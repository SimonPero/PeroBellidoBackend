import { dirname } from "path"
import { fileURLToPath } from "url"
const _filename= fileURLToPath(import.meta.url)
const _dirname = dirname(_filename)
export const _dirname_base = dirname(_filename).replace(/\/[^/]*$/,"/")
export default _dirname