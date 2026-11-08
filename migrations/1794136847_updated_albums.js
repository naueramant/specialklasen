/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_3287366145');

    // update field: thumbnail sizes for the album list (square tiles) and the album gallery
    collection.fields.addAt(
      1,
      new Field({
        hidden: false,
        id: 'file3760176746',
        maxSelect: 99,
        maxSize: 100000000,
        mimeTypes: [],
        name: 'images',
        presentable: false,
        protected: false,
        required: false,
        system: false,
        thumbs: ['300x300', '800x0'],
        type: 'file',
      })
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_3287366145');

    // update field
    collection.fields.addAt(
      1,
      new Field({
        hidden: false,
        id: 'file3760176746',
        maxSelect: 99,
        maxSize: 100000000,
        mimeTypes: [],
        name: 'images',
        presentable: false,
        protected: false,
        required: false,
        system: false,
        thumbs: [],
        type: 'file',
      })
    );

    return app.save(collection);
  }
);
