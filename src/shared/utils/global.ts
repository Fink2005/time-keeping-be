export const logPrettier = (log: unknown, message: string = "Here") => {
 
console.log('\x1b[34m',message, JSON.stringify(log, null, 2)
)
}
