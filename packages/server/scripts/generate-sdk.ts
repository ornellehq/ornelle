import { exec } from "node:child_process"
import { promisify } from "node:util"

const execAsync = promisify(exec)

export async function generateSDK() {
  try {
    console.log("generating sdk")
    const { stdout: _, stderr } = await execAsync(
      `cd ${__dirname}/../../sdks && pnpm generate-sdk:server`,
    )
    if (stderr) console.error("SDK Generation stderr:", stderr)

    // console.log("SDK Generation stdout:", stdout)
  } catch (error) {
    console.error("SDK Generation error:", error)
    throw error
  }
}
