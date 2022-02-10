const fbDel = require('firebase/storage');

const storageDelete = async (url) => {
  console.log('스토리지 내의 해당 사진을 삭제하는 작업을 시작할게요.');

  try {
    const storage = await fbDel.getStorage();
    const fileRef = await fbDel.ref(storage, url);
    const deleteFile = await fbDel.deleteObject(fileRef);

    return deleteFile;
  } catch (error) {
    return null
  }
}

module.exports = { storageDelete };