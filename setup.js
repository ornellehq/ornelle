#!/usr/bin/env node

/**
 * Ornelle Setup Script
 * This script:
 * 1. Copies sample .env files to .env files
 * 2. Prompts for required environment variables
 * 3. Updates .env files with provided values
 * 4. Runs database migrations
 */

const fs = require("node:fs")
const path = require("node:path")
const { execSync } = require("node:child_process")
const crypto = require("node:crypto")
const prompts = require("prompts")
const chalk = require("chalk")
const ora = require("ora")

// Add proper Ctrl+C handling
process.on("SIGINT", () => {
  console.log(chalk.yellow("\n\nSetup interrupted by user. Exiting..."))
  process.exit(0)
})

// Configure prompts to handle cancellation
const promptsWithCancellation = (questions, options = {}) => {
  return prompts(questions, {
    onCancel: () => {
      console.log(chalk.yellow("\n\nSetup interrupted by user. Exiting..."))
      process.exit(0)
    },
    ...options,
  })
}

// Define paths to sample .env files
const ENV_FILES = [
  {
    sample: path.join(__dirname, "packages/server/.env.sample"),
    target: path.join(__dirname, "packages/server/.env"),
    required: true,
  },
  {
    sample: path.join(__dirname, "packages/webapp/.env.sample"),
    target: path.join(__dirname, "packages/webapp/.env"),
    required: false,
  },
  {
    sample: path.join(__dirname, "packages/webpages/.env.sample"),
    target: path.join(__dirname, "packages/webpages/.env"),
    required: false,
  },
  {
    sample: path.join(__dirname, "packages/isomorphic-blocs/.env.sample"),
    target: path.join(__dirname, "packages/isomorphic-blocs/.env"),
    required: true,
  },
]

// Helper functions
function updateEnvFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf8")

  for (const [key, value] of Object.entries(replacements)) {
    // Handle different types of values and quoting correctly
    let formattedValue = value

    // For URLs and similar values that need quotes
    if (
      typeof value === "string" &&
      (key === "DATABASE_URL" ||
        value.includes("{") ||
        value.includes(" ") ||
        value.includes("/") ||
        (value.includes(":") && !value.startsWith('"')))
    ) {
      formattedValue = `"${value}"`
    }

    const regex = new RegExp(`${key}=.*`, "g")
    content = content.replace(regex, `${key}=${formattedValue}`)
  }

  fs.writeFileSync(filePath, content)
}

/**
 * Copy sample .env files to .env files
 */
async function setupEnvFiles() {
  console.log(chalk.bold("\n📝 Setting up environment files..."))

  for (const file of ENV_FILES) {
    const fileName = path.basename(file.target)
    const spinner = ora(`Processing ${fileName}`).start()

    // Check if sample file exists
    if (!fs.existsSync(file.sample)) {
      if (file.required) {
        spinner.fail(`Required sample file not found: ${file.sample}`)
        process.exit(1)
      } else {
        spinner.warn(`Optional sample file not found: ${file.sample}`)
        continue
      }
    }

    // Check if target file already exists
    if (fs.existsSync(file.target)) {
      spinner.stop()
      const { overwrite } = await promptsWithCancellation({
        type: "confirm",
        name: "overwrite",
        message: `${fileName} already exists. Overwrite?`,
        initial: false,
      })

      if (!overwrite) {
        console.log(chalk.yellow(`⏭️  Skipping ${fileName}`))
        continue
      }
      spinner.start(`Processing ${fileName}`)
    }

    // Copy sample file to target
    try {
      fs.copyFileSync(file.sample, file.target)
      spinner.succeed(`Created ${fileName}`)
    } catch (error) {
      spinner.fail(`Failed to create ${fileName}: ${error.message}`)
      if (file.required) {
        process.exit(1)
      }
    }
  }
}

/**
 * Database configuration
 */
async function configureDatabase() {
  console.log(chalk.bold("\n🛢️  Database Configuration"))

  const serverEnvPath = path.join(__dirname, "packages/server/.env")
  if (!fs.existsSync(serverEnvPath)) {
    console.log(chalk.red("❌ Server .env file not found"))
    return
  }

  // Get current system username
  let currentUsername = ""
  try {
    currentUsername = execSync("whoami").toString().trim()
  } catch (error) {
    try {
      currentUsername = execSync('echo "$USER"').toString().trim()
    } catch (innerError) {
      console.log(
        chalk.yellow("⚠️ Could not determine current username, using default"),
      )
      currentUsername = "postgres"
    }
  }

  const { dbUrl } = await promptsWithCancellation({
    type: "text",
    name: "dbUrl",
    message: "Enter PostgreSQL connection URL:",
    initial: `postgresql://${currentUsername}:@localhost:5432/ornelle-ats?schema=public`,
  })

  const spinner = ora("Updating database configuration").start()
  try {
    updateEnvFile(serverEnvPath, { DATABASE_URL: dbUrl })
    spinner.succeed("Database configuration updated")

    // Set up isomorphic-blocs .env file
    const isomorphicBlocsEnvPath = path.join(
      __dirname,
      "packages/isomorphic-blocs/.env",
    )

    if (!fs.existsSync(isomorphicBlocsEnvPath)) {
      console.log(chalk.yellow("⚠️ Creating isomorphic-blocs .env file"))
      // The file should already be created through the ENV_FILES setup
      updateEnvFile(isomorphicBlocsEnvPath, {
        DATABASE_URL: dbUrl,
        NODE_ENV: "development",
      })
    } else {
      updateEnvFile(isomorphicBlocsEnvPath, {
        DATABASE_URL: dbUrl,
        NODE_ENV: "development",
      })
      console.log(
        chalk.green("✓ Updated .env file for isomorphic-blocs package"),
      )
    }

    // Update the KeyToMothership in webpages .env to match Keys.pages value in server .env
    const webpagesEnvPath = path.join(__dirname, "packages/webpages/.env")
    if (fs.existsSync(webpagesEnvPath)) {
      const serverEnvContent = fs.readFileSync(serverEnvPath, "utf8")
      const keysMatch = serverEnvContent.match(/Keys=.*?"pages":"([^"]*)"/)
      if (keysMatch && keysMatch[1]) {
        updateEnvFile(webpagesEnvPath, { KeyToMothership: keysMatch[1] })
        console.log(chalk.green("✓ Updated encryption key in webpages .env"))
      }
    }
  } catch (error) {
    spinner.fail(`Failed to update database configuration: ${error.message}`)
  }
}

/**
 * Security configuration
 */
async function configureSecurity() {
  console.log(chalk.bold("\n🔐 Security Configuration"))

  const serverEnvPath = path.join(__dirname, "packages/server/.env")
  if (!fs.existsSync(serverEnvPath)) {
    console.log(chalk.red("❌ Server .env file not found"))
    return
  }

  // Generate secure secrets
  const workspaceSecret = crypto.randomBytes(32).toString("hex")
  const userSecret = crypto.randomBytes(32).toString("hex")

  console.log(chalk.green("✓ Generated secure secrets"))

  const spinner = ora("Updating security configuration").start()
  try {
    updateEnvFile(serverEnvPath, {
      WorkspaceSecret: workspaceSecret,
      UserSecret: userSecret,
    })
    spinner.succeed("Security configuration updated")
  } catch (error) {
    spinner.fail(`Failed to update security configuration: ${error.message}`)
  }
}

/**
 * Storage configuration
 */
async function configureStorage() {
  console.log(chalk.bold("\n📦 Storage Configuration"))

  const serverEnvPath = path.join(__dirname, "packages/server/.env")
  if (!fs.existsSync(serverEnvPath)) {
    console.log(chalk.red("❌ Server .env file not found"))
    return
  }

  const { storageType } = await promptsWithCancellation({
    type: "select",
    name: "storageType",
    message: "Select your file storage provider:",
    choices: [
      { title: "Local Storage (Default)", value: "local" },
      { title: "AWS S3 with CloudFront", value: "aws" },
    ],
    initial: 0,
  })

  if (storageType === "local") {
    const spinner = ora("Configuring local storage").start()
    try {
      updateEnvFile(serverEnvPath, { Storage: '{"provider":"local"}' })
      spinner.succeed("Local storage configured")
    } catch (error) {
      spinner.fail(`Failed to configure local storage: ${error.message}`)
    }
    return
  }

  // AWS Configuration
  console.log(chalk.blue("\nAWS S3/CloudFront Configuration:"))

  const questions = [
    {
      type: "text",
      name: "bucket",
      message: "AWS S3 Bucket:",
      validate: (value) => (value ? true : "Bucket name is required"),
    },
    {
      type: "text",
      name: "region",
      message: "AWS Region:",
      initial: "us-west-1",
    },
    {
      type: "text",
      name: "accessKey",
      message: "AWS Access Key:",
      validate: (value) => (value ? true : "Access key is required"),
    },
    {
      type: "password",
      name: "secretKey",
      message: "AWS Secret Key:",
      validate: (value) => (value ? true : "Secret key is required"),
    },
    {
      type: "text",
      name: "cloudFrontDomain",
      message: "CloudFront Domain (with https://):",
      validate: (value) =>
        value.startsWith("https://") ? true : "Domain must start with https://",
    },
    {
      type: "text",
      name: "keyPairId",
      message: "CloudFront Key Pair ID:",
      validate: (value) => (value ? true : "Key pair ID is required"),
    },
    {
      type: "text",
      name: "privateKey",
      message: "CloudFront Private Key (base64):",
      validate: (value) => (value ? true : "Private key is required"),
    },
  ]

  const awsConfig = await promptsWithCancellation(questions)

  const spinner = ora("Configuring AWS storage").start()
  try {
    const configObject = {
      provider: "aws",
      aws: {
        Bucket: awsConfig.bucket,
        Region: awsConfig.region,
        S3AccessKey: awsConfig.accessKey,
        S3SecretKey: awsConfig.secretKey,
        CloudFrontDomain: awsConfig.cloudFrontDomain,
        CloudFrontKeyPairId: awsConfig.keyPairId,
        CloudFrontPrivateKey: awsConfig.privateKey,
      },
    }

    updateEnvFile(serverEnvPath, { Storage: JSON.stringify(configObject) })
    spinner.succeed("AWS storage configured")
  } catch (error) {
    spinner.fail(`Failed to configure AWS storage: ${error.message}`)
  }
}

/**
 * Business information configuration
 */
async function configureBusiness() {
  console.log(chalk.bold("\n🏢 Business Information"))

  const webappEnvPath = path.join(__dirname, "packages/webapp/.env")
  if (!fs.existsSync(webappEnvPath)) {
    console.log(
      chalk.yellow(
        "⚠️ Webapp .env file not found, skipping business configuration",
      ),
    )
    return
  }

  const { businessName } = await promptsWithCancellation({
    type: "text",
    name: "businessName",
    message: "Enter your business or organization name:",
    initial: "Ornelle",
  })

  const spinner = ora("Updating business information").start()
  try {
    // Update webapp .env
    updateEnvFile(webappEnvPath, { VITE_BUSINESS_NAME: businessName })

    // Ensure server URLs are consistent across all .env files
    const serverEnvPath = path.join(__dirname, "packages/server/.env")
    const webpagesEnvPath = path.join(__dirname, "packages/webpages/.env")

    if (fs.existsSync(webpagesEnvPath)) {
      updateEnvFile(webpagesEnvPath, { Mothership: "http://localhost:3001" })
    }

    if (fs.existsSync(serverEnvPath)) {
      updateEnvFile(serverEnvPath, {
        PagesUrl: "http://localhost:4321",
        ServerUrl: "http://localhost:3001",
      })
    }

    spinner.succeed("Business information updated")
  } catch (error) {
    spinner.fail(`Failed to update business information: ${error.message}`)
  }
}

/**
 * Run database migrations
 */
async function runMigrations() {
  console.log(chalk.bold("\n🔄 Database Migrations"))
  console.log(
    chalk.yellow(
      "⚠️ Warning: You will be unable to start the app until migrations are created",
    ),
  )

  const { shouldRun } = await promptsWithCancellation({
    type: "confirm",
    name: "shouldRun",
    message: "Run database migrations?",
    initial: true,
  })

  if (!shouldRun) {
    console.log(chalk.yellow("⏭️ Skipping database migrations"))
    console.log(
      chalk.bold(
        "\n❗ Important: App will not start properly until migrations are created.",
      ),
    )
    console.log(chalk.cyan("To run migrations later, execute:"))
    console.log(chalk.cyan("  cd packages/isomorphic-blocs"))
    console.log(chalk.cyan("  pnpm prisma migrate dev"))
    return
  }

  const spinner = ora("Running database migrations").start()
  try {
    const originalDir = process.cwd()
    process.chdir(path.join(__dirname, "packages/isomorphic-blocs"))

    try {
      execSync("pnpm prisma migrate dev", { stdio: "pipe" })
      spinner.succeed("Database migrations completed")
    } catch (execError) {
      spinner.fail(`Migration error: ${execError.message}`)
      console.log(chalk.dim(execError.stdout?.toString() || ""))
      console.log(
        chalk.bold(
          "\n❗ App will not start properly until migrations are created successfully.",
        ),
      )
      console.log(chalk.cyan("Please fix the issues above and run:"))
      console.log(chalk.cyan("  cd packages/isomorphic-blocs"))
      console.log(chalk.cyan("  pnpm prisma migrate dev"))
    }

    process.chdir(originalDir)
  } catch (error) {
    spinner.fail(`Failed to run migrations: ${error.message}`)
    console.log(
      chalk.bold(
        "\n❗ App will not start properly until migrations are created successfully.",
      ),
    )
    console.log(chalk.cyan("Please fix any issues and run:"))
    console.log(chalk.cyan("  cd packages/isomorphic-blocs"))
    console.log(chalk.cyan("  pnpm prisma migrate dev"))
  }
}

/**
 * Main setup function
 */
async function setup() {
  console.log(chalk.bold.cyan("\n🔧 Ornelle Setup"))
  console.log(chalk.dim("===================="))

  try {
    // Welcome message
    console.log("\nWelcome to the Ornelle setup process!")
    console.log(
      "This wizard will help you configure your development environment.\n",
    )

    await setupEnvFiles()
    await configureDatabase()
    await configureSecurity()
    await configureStorage()
    await configureBusiness()
    await runMigrations()

    console.log(chalk.bold.green("\n✨ Setup completed successfully!"))
    console.log("\nNext steps:")
    console.log(
      `  1. ${chalk.cyan("pnpm dev")} - Start the development servers`,
    )
    console.log(
      `  2. Access the web app at: ${chalk.cyan("http://localhost:5173")}`,
    )
    console.log(
      `  3. Access the server at: ${chalk.cyan("http://localhost:3001")}`,
    )
    console.log(
      `  4. Access the public pages at: ${chalk.cyan("http://localhost:4321")}`,
    )
  } catch (error) {
    console.error(chalk.red(`\n❌ Setup failed: ${error.message}`))
    process.exit(1)
  }
}

// Run setup
setup()
