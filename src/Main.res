open Belt
open Webapi.Dom
open Stalwart.Attribute
open Stalwart.Node
open Stalwart.Mainloop

let root = 
    document
        -> Document.getElementsByTagName("body")
        -> HtmlCollection.toArray
        -> Array.getExn(0)

let init = ()
let update = (msg, _) => 
    location
        -> Location.setHash(msg)
let view = _ =>
    div([
        styles([
            ("background-color", "grey"),
            ("padding-left", "2rem"),
            ("padding-right", "0rem"),
            ("min-height", "100%"),
            ("display", "flex"),
            ("margin", "0")
        ])
    ], [
        div([
            styles([
                ("background-color", "white"),
                ("flex", "1"),
                ("margin-top", "2rem"),
                ("margin-bottom", "0rem"),
                ("display", "flex"),
                ("flex-direction", "column"),
            ])
        ], [
            div([
                styles([
                    ("background-color", "#ccc"),
                    ("padding", "1rem"),
                    ("flex", "0")
                ])
            ], [
                h1([
                ], [text("header")])
            ]),
            div([
                styles([
                    ("padding", "1rem")
                ])
            ], [ // content
                ol([], [
                    li([], [text("1")]),
                    li([], [text("2")]),
                    li([], [text("3")]),
                    li([], [text("4")]),
                    li([], [text("5")]),
                    li([], [text("6")]),
                    li([], [text("7")]),
                    li([], [text("8")]),
                    li([], [text("9")]),
                ])
            ]),
            div([
                styles([
                    ("background-color", "#ccc"),
                    ("padding", "1rem"),
                    ("flex", "0"),
                    ("margin-top", "auto")
                ])
            ], [
                text("footer")
            ])
        ]),
        div([
            styles([
                ("flex", "0 1 100px"),
            ])
        ], [
            div([
                styles([
                    ("background-color", "#9acd32"),
                    ("color", "white"),
                    ("height", "100%"),
                    ("width", "100px"),
                    ("padding-top", "1rem"),
                    ("padding-bottom", "1rem"),
                    ("position", "fixed"),
                    ("padding-left", "1rem"),
                    ("padding-right", "1rem"),
                ])
            ], [
                text("a sidebar yee wide")
            ])
        ]),
    ])

mainloop(root, init, update, view)
