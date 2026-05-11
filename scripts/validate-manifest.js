/**
 * Validation script for Prosjektportalen template packages
 * 
 * Validates:
 * - Manifest against JSON Schema
 * - Referenced files exist
 * - Version is bumped if content changed
 * - CHANGELOG.md is updated when version changes
 * 
 * Usage:
 *   npm run validate                                    # Validate all packages
 *   npm run validate:dev                                # Compare against dev branch
 *   npm run validate:main                               # Compare against main branch
 *   npm run validate -- --package=package-name          # Validate specific package
 * 
 * Direct usage:
 *   node scripts/validate-manifest.js [--package=package-name] [--base-ref=main]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const chalk = require('chalk');

const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');
const SCHEMA_DIR = path.join(ROOT_DIR, 'schema');
const MANIFEST_SCHEMA_PATH = path.join(SCHEMA_DIR, 'pppkg-manifest.schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        packageName: null,
        baseRef: 'main'
    };

    for (const arg of args) {
        if (arg.startsWith('--package=')) {
            options.packageName = arg.substring('--package='.length);
        } else if (arg.startsWith('--base-ref=')) {
            options.baseRef = arg.substring('--base-ref='.length);
        }
    }

    return options;
}

/**
 * Get list of packages to validate
 */
function getPackagesToValidate(packageName = null) {
    if (!fs.existsSync(PACKAGES_DIR)) {
        console.error(chalk.red(`✗ Packages directory not found: ${PACKAGES_DIR}`));
        process.exit(1);
    }

    const allPackages = fs.readdirSync(PACKAGES_DIR)
        .filter(name => {
            const fullPath = path.join(PACKAGES_DIR, name);
            return fs.statSync(fullPath).isDirectory();
        });

    if (packageName) {
        if (!allPackages.includes(packageName)) {
            console.error(chalk.red(`✗ Package not found: ${packageName}`));
            console.log(chalk.gray(`  Available packages: ${allPackages.join(', ')}`));
            process.exit(1);
        }
        return [packageName];
    }

    return allPackages;
}

/**
 * Load and validate manifest.json
 */
function validateManifest(packagePath, manifestPath) {
    const errors = [];

    if (!fs.existsSync(manifestPath)) {
        errors.push('manifest.json not found');
        return { valid: false, errors, manifest: null };
    }

    let manifest;
    try {
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');
        manifest = JSON.parse(manifestContent);
    } catch (error) {
        errors.push(`Failed to parse manifest.json: ${error.message}`);
        return { valid: false, errors, manifest: null };
    }

    const schemaContent = fs.readFileSync(MANIFEST_SCHEMA_PATH, 'utf8');
    const schema = JSON.parse(schemaContent);

    const validate = ajv.compile(schema);
    const valid = validate(manifest);

    if (!valid) {
        validate.errors.forEach(err => {
            errors.push(`${err.instancePath || '/'}: ${err.message}`);
        });
        return { valid: false, errors, manifest };
    }

    return { valid: true, errors: [], manifest };
}

/**
 * Check that all referenced files exist
 */
function validateReferencedFiles(packagePath, manifest) {
    const errors = [];

    if (manifest.thumbnail) {
        const thumbnailPath = path.join(packagePath, manifest.thumbnail);
        if (!fs.existsSync(thumbnailPath)) {
            errors.push(`Thumbnail not found: ${manifest.thumbnail}`);
        }
    }

    if (manifest.provisioning) {
        if (manifest.provisioning.hubTemplate) {
            const hubTemplatePath = path.join(packagePath, manifest.provisioning.hubTemplate);
            if (!fs.existsSync(hubTemplatePath)) {
                errors.push(`Hub template not found: ${manifest.provisioning.hubTemplate}`);
            }
        }

        if (manifest.provisioning.template) {
            const templatePath = path.join(packagePath, manifest.provisioning.template);
            if (!fs.existsSync(templatePath)) {
                errors.push(`Template not found: ${manifest.provisioning.template}`);
            }
        }

        if (manifest.provisioning.extensions) {
            for (const ext of manifest.provisioning.extensions) {
                const extPath = path.join(packagePath, ext.file);
                if (!fs.existsSync(extPath)) {
                    errors.push(`Extension file not found: ${ext.file}`);
                }
            }
        }
    }

    if (manifest.content && manifest.content.items) {
        for (const item of manifest.content.items) {
            const contentPath = path.join(packagePath, item.sourceFile);
            if (!fs.existsSync(contentPath)) {
                errors.push(`Content file not found: ${item.sourceFile}`);
            }
        }
    }

    if (manifest.changelog) {
        const changelogPath = path.join(packagePath, manifest.changelog);
        if (!fs.existsSync(changelogPath)) {
            errors.push(`CHANGELOG not found: ${manifest.changelog}`);
        }
    }

    return errors;
}

/**
 * Get changed files in package since base ref
 */
function getChangedFiles(packagePath, baseRef) {
    try {
        const relativePath = path.relative(ROOT_DIR, packagePath);
        const cmd = `git diff --name-only ${baseRef} -- "${relativePath}"`;
        const output = execSync(cmd, {
            cwd: ROOT_DIR,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
        const files = output.trim().split('\n').filter(f => f.length > 0);
        const fileList = files.length > 0 ? files.map(f => '    ' + f).join('\n') : '    none';
        console.log(chalk.gray(`  ↳ Changed files since ${baseRef}:\n${fileList}`));
        return files;
    } catch (error) {
        return null;
    }
}

/**
 * Get manifest from base ref
 */
function getManifestFromRef(packageName, baseRef) {
    try {
        const manifestRelPath = `packages/${packageName}/manifest.json`;
        const cmd = `git show ${baseRef}:${manifestRelPath}`;
        const output = execSync(cmd, {
            cwd: ROOT_DIR,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
        return JSON.parse(output);
    } catch (error) {
        return null;
    }
}

/**
 * Check if CHANGELOG.md was updated
 */
function checkChangelogUpdated(packagePath, manifest, baseRef) {
    if (!manifest.changelog) {
        return false;
    }

    try {
        const relativePath = path.relative(ROOT_DIR, packagePath);
        const changelogRelPath = path.join(relativePath, manifest.changelog);
        const cmd = `git diff --name-only ${baseRef} -- "${changelogRelPath}"`;
        const output = execSync(cmd, {
            cwd: ROOT_DIR,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
        return output.trim().length > 0;
    } catch (error) {
        return false;
    }
}

/**
 * Compare semantic versions
 */
function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        if (parts1[i] > parts2[i]) return 1;
        if (parts1[i] < parts2[i]) return -1;
    }
    return 0;
}

/**
 * Validate version bump if content changed
 */
function validateVersionBump(packageName, packagePath, currentManifest, baseRef) {
    const warnings = [];
    const errors = [];

    const changedFiles = getChangedFiles(packagePath, baseRef);

    if (changedFiles === null) {
        warnings.push('Could not check git history (not a git repo or base ref not found)');
        return { warnings, errors };
    }

    if (changedFiles.length === 0) {
        return { warnings, errors };
    }

    const baseManifest = getManifestFromRef(packageName, baseRef);

    if (!baseManifest) {
        warnings.push('New package detected (no base version to compare)');
        return { warnings, errors };
    }

    const currentVersion = currentManifest.version;
    const baseVersion = baseManifest.version;

    const contentChanged = changedFiles.some(file => {
        const fileName = path.basename(file);
        return fileName !== 'manifest.json' &&
            fileName !== 'README.md' &&
            fileName !== 'CHANGELOG.md';
    });

    if (contentChanged) {
        if (currentVersion === baseVersion) {
            errors.push(`Version must be bumped (content changed but version is still ${currentVersion})`);
        } else if (compareVersions(currentVersion, baseVersion) <= 0) {
            errors.push(`Version must be increased (current: ${currentVersion}, base: ${baseVersion})`);
        }
    }

    if (currentVersion !== baseVersion) {
        if (!currentManifest.changelog) {
            warnings.push('Version changed but no changelog file is configured. Consider creating and configuring one in the manifest.');
        } else {
            const changelogUpdated = checkChangelogUpdated(packagePath, currentManifest, baseRef);
            if (!changelogUpdated) {
                warnings.push(`Version changed but ${currentManifest.changelog} was not updated`);
            }
        }
    }

    return { warnings, errors };
}

/**
 * Validate a single package
 */
function validatePackage(packageName, options) {
    const packagePath = path.join(PACKAGES_DIR, packageName);
    const manifestPath = path.join(packagePath, 'manifest.json');

    console.log(chalk.cyan(`\n📋 Validating: ${packageName}`));

    const results = {
        packageName,
        valid: true,
        errors: [],
        warnings: []
    };

    console.log(chalk.gray('  ↳ Validating manifest against schema...'));
    const manifestValidation = validateManifest(packagePath, manifestPath);

    if (!manifestValidation.valid) {
        results.valid = false;
        results.errors.push(...manifestValidation.errors);
        console.log(chalk.red('  ✗ Manifest validation failed'));
        manifestValidation.errors.forEach(err => {
            console.log(chalk.red(`    - ${err}`));
        });
        return results;
    }

    console.log(chalk.green(`  ✓ Manifest valid (${manifestValidation.manifest.name} v${manifestValidation.manifest.version})`));

    console.log(chalk.gray('  ↳ Checking referenced files...'));
    const fileErrors = validateReferencedFiles(packagePath, manifestValidation.manifest);

    if (fileErrors.length > 0) {
        results.valid = false;
        results.errors.push(...fileErrors);
        console.log(chalk.red('  ✗ Referenced files check failed'));
        fileErrors.forEach(err => {
            console.log(chalk.red(`    - ${err}`));
        });
    } else {
        console.log(chalk.green('  ✓ All referenced files exist'));
    }

    if (!options.skipGitCheck) {
        console.log(chalk.gray('  ↳ Checking version bump...'));
        const versionCheck = validateVersionBump(
            packageName,
            packagePath,
            manifestValidation.manifest,
            options.baseRef
        );

        if (versionCheck.errors.length > 0) {
            results.valid = false;
            results.errors.push(...versionCheck.errors);
            console.log(chalk.red('  ✗ Version validation failed'));
            versionCheck.errors.forEach(err => {
                console.log(chalk.red(`    - ${err}`));
            });
        } else {
            console.log(chalk.green('  ✓ Version validation passed'));
        }

        if (versionCheck.warnings.length > 0) {
            results.warnings.push(...versionCheck.warnings);
            versionCheck.warnings.forEach(warn => {
                console.log(chalk.yellow(`  ⚠ ${warn}`));
            });
        }
    }

    if (results.valid) {
        console.log(chalk.green(`✓ ${packageName} validation passed`));
    } else {
        console.log(chalk.red(`✗ ${packageName} validation failed`));
    }

    return results;
}

/**
 * Main execution
 */
function main() {
    const options = parseArgs();

    console.log(chalk.bold.cyan('\n🔍 Prosjektportalen Package Validator\n'));

    const packages = getPackagesToValidate(options.packageName);
    console.log(chalk.gray(`Validating ${packages.length} package(s)...\n`));

    const results = packages.map(pkg => validatePackage(pkg, options));

    console.log(chalk.bold.cyan('\n────────────────────────────────────────────────────────────\n'));
    console.log(chalk.bold('📊 Validation Summary\n'));

    const passed = results.filter(r => r.valid).length;
    const failed = results.filter(r => !r.valid).length;
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

    if (passed > 0) {
        console.log(chalk.green(`  ✓ Passed: ${passed}`));
    }
    if (failed > 0) {
        console.log(chalk.red(`  ✗ Failed: ${failed}`));
    }
    if (totalWarnings > 0) {
        console.log(chalk.yellow(`  ⚠ Warnings: ${totalWarnings}`));
    }

    console.log('');

    if (failed > 0) {
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    validateManifest,
    validateReferencedFiles,
    validateVersionBump,
    validatePackage
};
