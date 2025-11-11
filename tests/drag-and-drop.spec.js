const { test, expect } = require('@playwright/test');

test.describe('Drag and Drop File Upload', () => {
  test('should open upload modal when a file is dropped onto the window', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');

    // Create a dummy file to drag
    const dummyFile = {
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is a test file.'),
    };

    // Create a DataTransfer object and add the file
    const dataTransfer = await page.evaluateHandle((file) => {
      const dt = new DataTransfer();
      const fileBlob = new Blob([file.buffer], { type: file.mimeType });
      const newFile = new File([fileBlob], file.name, { type: file.mimeType });
      dt.items.add(newFile);
      return dt;
    }, dummyFile);

    // Dispatch the dragenter and drop events
    await page.dispatchEvent('body', 'dragenter', { dataTransfer });
    await page.dispatchEvent('body', 'drop', { dataTransfer });

    // Wait for the modal to be visible
    const modal = await page.waitForSelector('#uploadModal', { state: 'visible' });

    // Assert that the modal is visible
    expect(modal).not.toBeNull();

    // Verify that the file input is populated
    const fileName = await page.evaluate(() => {
      const fileInput = document.getElementById('fileInput');
      return fileInput.files[0].name;
    });
    expect(fileName).toBe(dummyFile.name);
  });
});
