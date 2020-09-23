"use strict"

module.exports = function (target) {
  /**
   * App Worker 进程的 Loader，继承 Egg.AppWorkerLoader
   * @extends Egg.AppWorkerLoader
   */
  class OpsAppWorkerLoader extends target.AppWorkerLoader {
    constructor(options) {
      super(options)

      // 使用 egg 提供的 console, 能够统一控制日志输出级别
      this.logger =
        options.logger || options.console || console

      this.logger.info(
        "[ops-loader] ops_loader started, pid is %s",
        process.pid
      )
    }
  }

  target.AppWorkerLoader = OpsAppWorkerLoader
}
