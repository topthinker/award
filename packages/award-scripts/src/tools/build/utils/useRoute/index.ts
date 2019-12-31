/**
 * 启动子进程来执行路由解析工作
 */
import { spawn } from 'child_process';
import { join } from 'path';
import { complierInfo } from '../../../tool';

export default () =>
  new Promise(resolve => {
    complierInfo('正在分析是否使用路由......');
    const parseRoute = spawn('node', [join(__dirname, './useRoute.js')]);
    let isError = false;

    // 子进程退出
    parseRoute.on('exit', () => {
      if (isError) {
        process.exit(-1);
      } else {
        resolve(false);
      }
    });

    parseRoute.stdout.on('data', data => {
      const content = data.toString().replace(/\s$/, '');
      if (/error/.test(content) || isError) {
        isError = true;
        console.error(content);
      } else {
        if (isError) {
          process.exit(-1);
        } else if (content === 'use-route') {
          resolve(true);
        }
      }
    });
  });