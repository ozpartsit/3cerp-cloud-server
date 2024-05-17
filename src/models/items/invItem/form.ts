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
                                "description"
                            ]
                        },
                        {
                            "value": "details",
                            "fields": [
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
                        }
                    ]
                },
                {
                    "value": "prices",
                    "editable": true,
                    "fields": [
                        "prices"
                    ]
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