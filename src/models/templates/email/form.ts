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
                                "trigger",
                                "language"
                            ]
                        },
                        {
                            "value": "email",
                            "fields": [
                                "subject",
                                "text",
                                "html"
                            ]
                        },

                    ]
                },

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