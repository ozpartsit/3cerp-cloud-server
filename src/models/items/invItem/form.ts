export default {
    "tabs": [
        {
            "value": "main",
            "editable": true,
            "sections": [
                {
                    "value": "general",
                    "editable": true,
                    "columns": [
                        {
                            "value": "name",
                            "fields": [
                                "name",
                                "description",
                                "urlComponent",
                                "html"
                            ]
                        },
                        {
                            "value": "details",
                            "fields": [
                                "sku",
                                "barcode",
                                "manufacturer",
                                "weight",
                                "priceGroup"
                            ]
                        },
                        {
                            "value": "details",
                            "fields": [
                                "images",
                                "coo",
                                "category",
                                "group"
                            ]
                        },
                        {
                            "value": "metatags",
                            "fields": [
                                "metaTitle",
                                "metaDescription",
                                "metaKeywords"
                            ]
                        },
                    ]
                },
                {
                    "value": "prices",
                    "editable": true,
                    "tables": [{
                        "value": "prices",
                        "subdoc": "prices",
                        "columns": [
                            {
                                "value": "price",
                                "fields": [
                                    "price",
                                    "currency",
                                ]
                            },
                            {
                                "value": "moq",
                                "fields": [
                                    "moq",
                                ]
                            },
                            {
                                "value": "other",
                                "fields": [
                                    "priceLevel",
                                ]
                            },
                        ],
                    }]
                },
                {
                    "value": "relatedItems",
                    "editable": true,
                    "tables": [{
                        "value": "relatedItems",
                        "subdoc": "relatedItems",
                        "columns": [
                            {
                                "value": "item",
                                "fields": [
                                    "related",
                                    "description",
                                ]
                            },
                            {
                                "value": "other",
                                "fields": [
                                    "language",
                                ]
                            },
                        ],
                    }]
                },
                {
                    "value": "parameters",
                    "editable": true,
                    "tables": [{
                        "value": "parameters",
                        "subdoc": "parameters",
                        "columns": [
                            {
                                "value": "label",
                                "fields": [
                                    "name",
                                ]
                            },
                            {
                                "value": "value",
                                "fields": [
                                    "value",
                                ]
                            },
                            {
                                "value": "other",
                                "fields": [
                                    "language",
                                ]
                            },
                        ],
                    }]
                }
            ]
        },
        {
            "value": "communication",
            "editable": false,
            "sections": [
                {
                    "value": "notes",
                    "editable": false,
                    "component": "Notes"
                }
            ]
        },
        {
            "value": "systeminformation",
            "editable": false,
            "sections": [
                {
                    "value": "changelogs",
                    "editable": false,
                    "component": "ChangeLogs"
                }
            ]
        }
    ]
}