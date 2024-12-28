
// import { setupServer } from "msw/node";
// import { http } from "msw";

// interface HandlerConfig {
//   method?: "get" | "post" | "put" | "delete"; // HTTPメソッド
//   path: string; // リクエストするパス
//   res: (req:any, res:any,ctx:any) => any; // レスポンスを生成する関数
// }
// // createServer 関数の定義
// export function createServer(handlerConfig: HandlerConfig[]) {
//   // 各ハンドラを設定
//   const handlers = handlerConfig.map((config) => {
//     return http[config.method || "get"](config.path, 
//      // @ts-ignore
//     (req, res, ctx) => {
//       // リクエストに応じたレスポンスを返す
//       return res(ctx.json(config.res(req, res, ctx)));
//     });
//   });
//   const server = setupServer(...handlers);

//   beforeAll(() => {
//     server.listen(); // リクエストインターセプト開始
//   });

//   afterEach(() => {
//     server.resetHandlers(); // ハンドラのリセット
//   });

//   afterAll(() => {
//     server.close(); // サーバー停止
//   });
// }
