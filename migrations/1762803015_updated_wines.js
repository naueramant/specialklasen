/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_2474087662');

    // remove field
    collection.fields.removeById('text1587448267');

    // add field
    collection.fields.addAt(
      12,
      new Field({
        hidden: false,
        id: 'select1587448267',
        maxSelect: 1,
        name: 'location',
        presentable: false,
        required: false,
        system: false,
        type: 'select',
        values: ['Peter', 'Jonas', 'Mads', 'Jacob', 'Jeppe', 'Ikke ankommet'],
      })
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_2474087662');

    // add field
    collection.fields.addAt(
      10,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text1587448267',
        max: 0,
        min: 0,
        name: 'location',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: 'text',
      })
    );

    // remove field
    collection.fields.removeById('select1587448267');

    return app.save(collection);
  }
);
