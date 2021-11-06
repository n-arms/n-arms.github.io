open Belt
open Webapi.Dom
open Stalwart.Attribute
open Stalwart.Node
open Stalwart.Mainloop 

type button
    = BlogButton
    | MainButton

type appMsg
    = HeaderHover(button)
    | HeaderUnHover(button)
    | HeaderClick(button)

type appState = {
    page: button,
    hover: option<button>
}

let root = 
    document
        -> Document.getElementsByTagName("body")
        -> HtmlCollection.toArray
        -> Array.getExn(0)

let getContent = hash =>
    if hash == "" {
        button([
            "not-root" -> onClick
        ], [
            text("currently at root, click to leave")
        ])
    } else {
        button([
            "" -> onClick
        ], [
            text("not at root")
        ])
    }

let alternate = content => {
    let color = ref("#ffffff")
    content
    -> Array.map(elem => {
        if color.contents == "#ffffff" {
            color := "#e6e6e6"
        } else {
            color := "#ffffff"
        }
        div([
            styles([
                ("background-color", color.contents),
                ("padding", "1em")
            ])
        ], [
            elem
        ])
    })
}

let header = state =>
    div([
        styles([
            ("position", "sticky"),
            ("color", "#bee67e"),
            ("background-color", "rgba(32, 32, 32, 0.8)"),
            ("top", "0"),
            ("margin", "0"),
            ("display", "flex")
        ])
    ], [
        h1(if state.hover == Some(MainButton) {[
            styles([
                ("margin", "0.25em"),
                ("margin-left", "3em"),
            ]),
            onMouseOut(HeaderUnHover(MainButton)),
            onClick(HeaderClick(MainButton))
        ]} else {[
            styles([
                ("margin", "0.25em"),
                ("margin-left", "3em"),
                ("color", "white")
            ]),
            onMouseOver(HeaderHover(MainButton))
        ]}, [text("n-arms")]),

        p(if state.hover == Some(BlogButton) {[
            onMouseOut(HeaderUnHover(BlogButton)),
            onClick(HeaderClick(BlogButton)),
            styles([
                ("margin", "1em"),
                ("margin-left", "3em"),
                ("font-size", "1.2em")
            ])
        ]} else {[
            styles([
                ("margin", "1em"),
                ("margin-left", "3em"),
                ("color", "white"),
                ("font-size", "1.2em")
            ]),
            onMouseOver(HeaderHover(BlogButton)),
        ]}, [text("blog")])
    ])

let title = _ => 
    div([
        props([
            ("id", "header")
        ]),
        styles([
            ("background-color", "#2f302f"),
            ("padding-left", "1em"),
            ("padding-top", "3em"),
            ("padding-bottom", "3em"),
            ("display", "flex"),
            ("flex-wrap", "wrap"),
            ("justify-content", "center"),
        ])
    ], [
        div([
            styles([
                ("flex", "0 0 20em"),
                ("width", "0 0 20em"),
                ("margin", "0"),
                ("padding", "0"),
            ])
        ], [
            h1([
                styles([
                    ("color", "#bee67e"),
                    ("font-size", "6em"),
                    ("width", "0 0 20em"),
                    ("margin", "0em"),
                ])
            ], [
                text("n-arms")
            ]),
            p([
                styles([
                    ("font-size", "25px"),
                    ("margin-bottom", "0em"),
                    ("color", "white")
                ])
            ], [
                text("the coolest")
            ])
        ]),
        div([
            styles([
                ("margin", "0"),
                ("padding", "0"),
                ("flex", "0 0 10em"),
                ("min-width", "0 0 10em"),
                ("font-size", "40px"),
                ("color", "white"),
                ("margin-top", "0.5em")
            ])
        ], [
            text("guess what, he is pretty cool")
        ])
    ])

let main = state => div([], [
    title(state),
    div([
        props([
            ("id", "content")
        ])
    ], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    -> Js.Array2.map(n => 
        div([
            styles([
                ("padding", "3em")
            ])
        ], [
            text(`thing ${n -> Int.toString}`)
        ]))
    -> alternate)
])

let blog = _ => div([], 
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    -> Js.Array2.map(n =>
        div([
            styles([
                ("padding", "3em")
            ])
        ], [
            text(`blog article ${n -> Int.toString}`)
        ]))
    -> alternate)


let view = state => div([
    styles([
        ("id", "content"),
        ("background-color", "#2f302f"),
        ("margin", "0")
    ])
], [
    header(state),
    switch state.page {
        | BlogButton => blog(state)
        | MainButton => main(state)
    }
])



let init = {page: MainButton, hover: None}
let update = (msg, state) => {
    switch msg {
        | HeaderHover(target) => {
            {page: state.page, hover: Some(target)}
        }
        | HeaderUnHover(target) => {
            {page: state.page, hover: None}
        }
        | HeaderClick(target) => {
            location -> Location.setHash(switch target {
                | BlogButton => "blog"
                | MainButton => ""
            })
            {page: target, hover: Some(target)}
        }
    }
}

mainloop(root, init, update, view)
