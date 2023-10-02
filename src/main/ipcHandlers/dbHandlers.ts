import { ipcMain } from 'electron';
import { dbConnectionTest } from '../db';

export default function setupDBHandlers() {
  ipcMain.on('test-db-connection', async (event) => {
    try {
      await dbConnectionTest();
      event.reply('test-db-connection-result', {
        success: true,
        message: 'Connection Successful',
      });
    } catch (error) {
      let errorMessage = 'Connection Failed: Unknown error';
      if (error instanceof Error) {
        errorMessage = `Connection Failed: ${error.message}`;
      }

      event.reply('test-db-connection-result', {
        success: false,
        message: errorMessage,
      });
    }
  });

  // Other database-related IPC handlers can go here...
}
