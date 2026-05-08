/**
 * Build script for Prosjektportalen template packages
 * 
 * Usage:
 *   npm run build:packages              # Build all packages
 *   npm run build:package -- --name=package-name  # Build specific package
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const chalk = require('chalk');

const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SCHEMA_DIR = path.join(ROOT_DIR, 'schema');
const CATALOG_PATH = path.join(ROOT_DIR, 'catalog.json');
const MANIFEST_SCHEMA_PATH = path.join(SCHEMA_DIR, 'pppkg-manifest.schema.json');
const GITHUB_REPO = 'Puzzlepart/prosjektportalen-hosting';
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/main`;
const GITHUB_RELEASE_BASE = `https://github.com/${GITHUB_REPO}/releases/download`;

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    packageName: null
  };

  for (const arg of args) {
    if (arg.startsWith('--name=')) {
      options.packageName = arg.substring('--name='.length);
    } else if (arg.startsWith('--name')) {
      const idx = args.indexOf(arg);
      if (idx !== -1 && args[idx + 1]) {
        options.packageName = args[idx + 1];
      }
    }
  }

  return options;
}

/**
 * Get list of package directories to build
 */
function getPackagesToBuild(packageName = null) {
  if (!fs.existsSync(PACKAGES_DIR)) {
    console.error(chalk.red(`✗ Packages directory not found: ${PACKAGES_DIR}`));
    process.exit(1);
  }

  const allPackages = fs.readdirSync(PACKAGES_DIR)
    .filter(name => {
      const fullPath = path.join(PACKAGES_DIR, name);
      return fs.statSync(fullPath).isDirectory() && name !== '.gitkeep';
    });

  if (packageName) {
    if (!allPackages.includes(packageName)) {
      console.error(chalk.red(`✗ Package not found: ${packageName}`));
      console.log(chalk.gray(`  Available packages: ${allPackages.join(', ')}`));
      process.exit(1);
    }
    return [packageName];
  }

  if (allPackages.length === 0) {
    console.log(chalk.yellow('⚠ No packages found in packages/ directory'));
    process.exit(0);
  }

  return allPackages;
}

/**
 * Load and validate manifest.json
 */
function validateManifest(packagePath, manifestPath) {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`manifest.json not found in ${packagePath}`);
  }

  let manifest;
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    manifest = JSON.parse(manifestContent);
  } catch (error) {
    throw new Error(`Failed to parse manifest.json: ${error.message}`);
  }

  const schemaContent = fs.readFileSync(MANIFEST_SCHEMA_PATH, 'utf8');
  const schema = JSON.parse(schemaContent);

  const validate = ajv.compile(schema);
  const valid = validate(manifest);

  if (!valid) {
    const errors = validate.errors.map(err => {
      return `  - ${err.instancePath || '/'}: ${err.message}`;
    }).join('\n');
    throw new Error(`Manifest validation failed:\n${errors}`);
  }

  return manifest;
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
      errors.push(`Changelog not found: ${manifest.changelog}`);
    }
  }

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
  
  const packageEntry = {
    id: manifest.id,
    name: manifest.name,
    description: manifest.description || '',
    version: manifest.version,
    type: manifest.type,
    author: manifest.author,
    tags: manifest.tags || [],
    thumbnail: manifest.thumbnail 
      ? `${GITHUB_RAW_BASE}/packages/${packageName}/${manifest.thumbnail}`
      : undefined,
    downloadUrl: `${GITHUB_RELEASE_BASE}/v${manifest.version}/${packageName}-${manifest.version}.pppkg`,
    minPPVersion: manifest.minPPVersion,
    publishedDate: new Date().toISOString().split('T')[0],
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
async function buildPackage(packageName) {
  console.log(chalk.cyan(`\n📦 Building package: ${packageName}`));
  
  const packagePath = path.join(PACKAGES_DIR, packageName);
  const manifestPath = path.join(packagePath, 'manifest.json');

  try {
    console.log(chalk.gray('  ↳ Validating manifest.json...'));
    const manifest = validateManifest(packagePath, manifestPath);
    console.log(chalk.green(`  ✓ Manifest valid (${manifest.name} v${manifest.version})`));

    console.log(chalk.gray('  ↳ Validating referenced files...'));
    validateReferencedFiles(packagePath, manifest);
    console.log(chalk.green('  ✓ All referenced files exist'));

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
  const packages = getPackagesToBuild(options.packageName);

  console.log(chalk.gray(`Building ${packages.length} package(s)...\n`));

  let successCount = 0;
  let failCount = 0;

  for (const packageName of packages) {
    const success = await buildPackage(packageName);
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
