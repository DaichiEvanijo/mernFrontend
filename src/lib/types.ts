import {z} from "zod"



const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
export const registerSchema = z.object({
  user:z.string().regex(USER_REGEX, "4 to 24 characters and must begin with a letter.Letters, numbers, underscores, hyphens allowed. Allowed special character."),
  pwd:z.string().regex(PWD_REGEX, "8 to 24 characters. must include uppercase and lowecase letters. must include uppercase and lowecase letters"), 
  matchPwd:z.string()
}).refine(data => data.pwd === data.matchPwd,{
  message:"Passwords must match",
  path:["matchPwd"]
})
export type RegisterSchema = z.infer<typeof registerSchema>




export const loginSchema = z.object({
  user:z.string().min(1, "username is required"),
  pwd:z.string().min(1, "password is required")
})
export type LoginSchema = z.infer<typeof loginSchema>




export const postSchema = z.object({
  title:z.string().min(1, "title is required"),
  body:z.string().min(1, "body is required")
})
export type PostSchema = z.infer<typeof postSchema>
// z.infer<typeof postSchema>: 単純なスキーマオブジェクト に対して使用。関数ではなく、Zod のスキーマそのものを指す。
// z.infer<ReturnType<typeof postSchema>>: 関数がスキーマを返す場合に使用。関数の戻り値（スキーマ）の型を推論する必要があるときに使う。




export const postEditSchema = z.object({
  title:z.string().min(1, "title is required"),
  body:z.string().min(1, "body is required")
})
export type PostEditSchema = z.infer<typeof postEditSchema>







