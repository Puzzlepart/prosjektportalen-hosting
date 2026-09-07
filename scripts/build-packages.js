/**
 * Build script for Prosjektportalen template packages
 * 
 * Usage:
 *   npm run build:packages                            # Build all packages (validate against main)
 *   npm run build:dev                                 # Build all (validate against dev)
 *   npm run build:main                                # Build all (validate against main)
 *   npm run build:package -- --name=package-name      # Build specific package
 *   npm run build:package -- --name=pkg-a,pkg-b --skip-version-check
 * 
 * Direct usage:
 *   node scripts/build-packages.js [--name=package-name[,package-name...]] [--base-ref=main] [--skip-version-check]
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const chalk = require('chalk');
const validator = require('./validate-manifest');

const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const CATALOG_PATH = path.join(ROOT_DIR, 'catalog.json');
const GITHUB_REPO = 'Puzzlepart/prosjektportalen-hosting';
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/main`;
// The .pppkg is served from the committed `dist/` folder via raw.githubusercontent.com,
// which is CORS-enabled (`Access-Control-Allow-Origin: *`). GitHub *release* download
// URLs (github.com/.../releases/download/...) are NOT CORS-enabled and are blocked by
// the browser when the SPFx catalog fetches them, so we do not use them.
const GITHUB_DIST_BASE = `${GITHUB_RAW_BASE}/dist`;

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    packageNames: [],
    baseRef: 'main',
    skipVersionCheck: false
  };
  const addPackageNames = value => {
    options.packageNames.push(
      ...value.split(',').map(name => name.trim()).filter(Boolean)
    );
  };

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg.startsWith('--name=')) {
      addPackageNames(arg.substring('--name='.length));
    } else if (arg === '--name') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        console.error(chalk.red('✗ --name requires one or more package names'));
        process.exit(1);
      }
      addPackageNames(value);
      index++;
    } else if (arg.startsWith('--base-ref=')) {
      options.baseRef = arg.substring('--base-ref='.length);
    } else if (arg === '--skip-version-check') {
      options.skipVersionCheck = true;
    } else {
      console.error(chalk.red(`✗ Unknown argument: ${arg}`));
      process.exit(1);
    }
  }

  options.packageNames = [...new Set(options.packageNames.filter(Boolean))];
  return options;
}

/**
 * Get list of package directories to build
 */
function getPackagesToBuild(packageNames = []) {
  if (!fs.existsSync(PACKAGES_DIR)) {
    console.error(chalk.red(`✗ Packages directory not found: ${PACKAGES_DIR}`));
    process.exit(1);
  }

  const allPackages = fs.readdirSync(PACKAGES_DIR)
    .filter(name => {
      const fullPath = path.join(PACKAGES_DIR, name);
      return fs.statSync(fullPath).isDirectory() && name !== '.gitkeep';
    });

  if (packageNames.length > 0) {
    const missingPackages = packageNames.filter(name => !allPackages.includes(name));
    if (missingPackages.length > 0) {
      console.error(chalk.red(`✗ Package(s) not found: ${missingPackages.join(', ')}`));
      console.log(chalk.gray(`  Available packages: ${allPackages.join(', ')}`));
      process.exit(1);
    }
    return packageNames;
  }

  if (allPackages.length === 0) {
    console.log(chalk.yellow('⚠ No packages found in packages/ directory'));
    process.exit(0);
  }

  return allPackages;
}

/**
 * Load and validate manifest.json using shared validator
 */
function loadAndValidateManifest(packagePath, manifestPath) {
  const validation = validator.validateManifest(packagePath, manifestPath);
  
  if (!validation.valid) {
    const errors = validation.errors.map(err => `  - ${err}`).join('\n');
    throw new Error(`Manifest validation failed:\n${errors}`);
  }

  return validation.manifest;
}

/**
 * Check that all referenced files exist using shared validator
 */
function checkReferencedFiles(packagePath, manifest) {
  const errors = validator.validateReferencedFiles(packagePath, manifest);
  
  const readmePath = path.join(packagePath, 'README.md');
  if (!fs.existsSync(readmePath)) {
    errors.push('README.md not found');
  }

  if (errors.length > 0) {
    throw new Error('File reference validation failed:\n  - ' + errors.join('\n  - '));
  }
}

/**
 * Create .pppkg zip file
 */
async function createPackage(packageName, packagePath, manifest) {
  const outputFilename = `${packageName}-${manifest.version}.pppkg`;
  const outputPath = path.join(DIST_DIR, outputFilename);

  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => {
      const sizeKB = (archive.pointer() / 1024).toFixed(2);
      resolve({ path: outputPath, size: sizeKB });
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    archive.directory(packagePath, false);

    archive.finalize();
  });
}

/**
 * Update catalog.json with package metadata
 */
function updateCatalog(packageName, manifest) {
  let catalog = {
    $schema: `${GITHUB_RAW_BASE}/schema/catalog.schema.json`,
    lastUpdated: new Date().toISOString(),
    packages: []
  };

  if (fs.existsSync(CATALOG_PATH)) {
    try {
      const catalogContent = fs.readFileSync(CATALOG_PATH, 'utf8');
      catalog = JSON.parse(catalogContent);
    } catch (error) {
      console.warn(chalk.yellow(`⚠ Failed to parse existing catalog.json, creating new: ${error.message}`));
    }
  }

  const existingIndex = catalog.packages.findIndex(pkg => pkg.id === manifest.id);
  const existingEntry = existingIndex !== -1 ? catalog.packages[existingIndex] : undefined;

  const packageEntry = {
    id: manifest.id,
    name: manifest.name,
    description: manifest.description || '',
    version: manifest.version,
    type: manifest.type,
    cloudCompatible: manifest.cloudCompatible,
    cloudCompatibleReason: manifest.cloudCompatibleReason,
    requiresBestillingsportalen: manifest.requiresBestillingsportalen,
    requiresEntra: manifest.requiresEntra,
    languages: manifest.languages,
    hidden: manifest.hidden ? true : undefined,
    icon: manifest.icon,
    author: manifest.author,
    tags: manifest.tags || [],
    thumbnail: manifest.thumbnail
      ? `${GITHUB_RAW_BASE}/packages/${packageName}/${manifest.thumbnail}`
      : undefined,
    screenshots:
      manifest.screenshots && manifest.screenshots.length > 0
        ? manifest.screenshots.map(
            (shot) => `${GITHUB_RAW_BASE}/packages/${packageName}/${shot}`
          )
        : undefined,
    downloadUrl: `${GITHUB_DIST_BASE}/${packageName}-${manifest.version}.pppkg`,
    minPPVersion: manifest.minPPVersion,
    // Prefer the manifest-authored date; otherwise keep the existing catalog
    // date so a rebuild doesn't reset it; fall back to today for a new package.
    publishedDate:
      manifest.publishedDate ||
      (existingEntry && existingEntry.publishedDate) ||
      new Date().toISOString().split('T')[0],
    changelogUrl: manifest.changelog
      ? `${GITHUB_RAW_BASE}/packages/${packageName}/${manifest.changelog}`
      : undefined
  };

  Object.keys(packageEntry).forEach(key => {
    if (packageEntry[key] === undefined) {
      delete packageEntry[key];
    }
  });

  if (existingIndex !== -1) {
    catalog.packages[existingIndex] = packageEntry;
  } else {
    catalog.packages.push(packageEntry);
  }

  catalog.lastUpdated = new Date().toISOString();

  catalog.packages.sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
}

/**
 * Build a single package
 */
async function buildPackage(packageName, options) {
  console.log(chalk.cyan(`\n📦 Building package: ${packageName}`));
  
  const packagePath = path.join(PACKAGES_DIR, packageName);
  const manifestPath = path.join(packagePath, 'manifest.json');

  try {
    console.log(chalk.gray('  ↳ Validating manifest.json...'));
    const manifest = loadAndValidateManifest(packagePath, manifestPath);
    console.log(chalk.green(`  ✓ Manifest valid (${manifest.name} v${manifest.version})`));

    console.log(chalk.gray('  ↳ Validating referenced files...'));
    checkReferencedFiles(packagePath, manifest);
    console.log(chalk.green('  ✓ All referenced files exist'));

    if (options.skipVersionCheck) {
      console.log(chalk.yellow('  ⚠ Version bump check skipped (--skip-version-check)'));
    } else {
      console.log(chalk.gray('  ↳ Checking version bump...'));
      const versionCheck = validator.validateVersionBump(
        packageName,
        packagePath,
        manifest,
        options.baseRef
      );

      if (versionCheck.errors.length > 0) {
        const errors = versionCheck.errors.map(err => `  - ${err}`).join('\n');
        throw new Error(`Version validation failed:\n${errors}`);
      }
      console.log(chalk.green('  ✓ Version validation passed'));

      if (versionCheck.warnings.length > 0) {
        versionCheck.warnings.forEach(warn => {
          console.log(chalk.yellow(`  ⚠ ${warn}`));
        });
      }
    }

    console.log(chalk.gray('  ↳ Creating .pppkg archive...'));
    const result = await createPackage(packageName, packagePath, manifest);
    console.log(chalk.green(`  ✓ Package created: ${path.basename(result.path)} (${result.size} KB)`));

    console.log(chalk.gray('  ↳ Updating catalog.json...'));
    updateCatalog(packageName, manifest);
    console.log(chalk.green('  ✓ Catalog updated'));

    console.log(chalk.green(`✓ ${packageName} built successfully\n`));
    return true;

  } catch (error) {
    console.error(chalk.red(`✗ Failed to build ${packageName}:`));
    console.error(chalk.red(`  ${error.message}\n`));
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(chalk.bold('\n🏗️  Prosjektportalen Package Builder\n'));

  const options = parseArgs();
  const packages = getPackagesToBuild(options.packageNames);

  console.log(chalk.gray(`Building ${packages.length} package(s)...\n`));

  let successCount = 0;
  let failCount = 0;

  for (const packageName of packages) {
    const success = await buildPackage(packageName, options);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(chalk.bold('─'.repeat(60)));
  console.log(chalk.bold('\n📊 Build Summary\n'));
  console.log(chalk.green(`  ✓ Successful: ${successCount}`));
  if (failCount > 0) {
    console.log(chalk.red(`  ✗ Failed: ${failCount}`));
  }
  console.log('');

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch(error => {
  console.error(chalk.red(`\n✗ Fatal error: ${error.message}`));
  process.exit(1);
});
