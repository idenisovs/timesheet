export async function handleModalResult<T>(promise: Promise<T>) {
  try {
    return await promise;
  } catch (e) {
    return null;
  }
}
