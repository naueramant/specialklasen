/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_2474087662');

    // add field
    collection.fields.addAt(
      13,
      new Field({
        hidden: false,
        id: 'select1768000000',
        maxSelect: 1,
        name: 'owner',
        presentable: false,
        required: false,
        system: false,
        type: 'select',
        values: ['Fælles', 'Peter', 'Jonas', 'Mads', 'Jacob', 'Jeppe'],
      })
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_2474087662');

    // remove field
    collection.fields.removeById('select1768000000');

    return app.save(collection);
  }
);
