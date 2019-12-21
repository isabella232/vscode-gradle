import * as assert from 'assert';
import * as vscode from 'vscode';

describe('without any build file or local gradle wrapper', () => {
  it('should not be present', () => {
    assert.ok(vscode.extensions.getExtension('richardwillis.vscode-gradle'));
  });

  it('should not be activated', async () => {
    const extension = vscode.extensions.getExtension(
      'richardwillis.vscode-gradle'
    );
    assert.ok(extension);
    assert.equal(extension!.isActive, false);
    const tasks = await vscode.tasks.fetchTasks({
      type: 'gradle'
    });
    assert.equal(tasks.length === 0, true);
  });
});