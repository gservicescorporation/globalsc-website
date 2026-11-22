import { createRouteHandler } from "uploadthing/next"
import { uploadRouter } from "./core"

// Requer UPLOADTHING_TOKEN no ambiente.
export const { GET, POST } = createRouteHandler({ router: uploadRouter })
