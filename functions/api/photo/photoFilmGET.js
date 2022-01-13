const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db')

module.exports = async (req, res) => {

  const { pageNum } = req.query;

  const { filmId } = req.params;
  if (!filmId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  
  let client;

  try {

    client = await db.connect(req);

    photoNum = 10 * ( pageNum - 1 )

    const photosOfFilm = await photoDB.getPhotosByFilm(client, filmId, photoNum);

    if (photosOfFilm.length == 0) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO_OF_STYLE_EXIST));

    res.status(sc.OK).send(success(sc.OK, rm.READ_PHOTOS_OF_FILM_SUCCESS, photosOfFilm));    
  } catch (error) {

    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  };
};