open Belt
open Webapi.Dom
open Stalwart.Attribute
open Stalwart.Node
open Stalwart.Mainloop 

type button
    = BlogButton
    | MainButton
    | GitHubFooter

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

let alternate : array<(html<'a>, html<'a>)> => array<html<'a>> = content => {
    let side = ref(false)
    content
    -> Array.map(((picture, text)) => {
        side := !side.contents
        div([
            styles([
                ("background-color", if side.contents {
                    "#ffffff"
                } else {
                    "#e6e6e6"
                }),
                ("padding", "1em"),
                ("display", "flex")
            ])
        ], if side.contents {[
            picture,
            text
        ]} else {[
            text,
            picture
        ]})
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
                ("margin-left", "2em"),
            ]),
            onMouseOut(HeaderUnHover(MainButton)),
            onClick(HeaderClick(MainButton))
        ]} else {[
            styles([
                ("margin", "0.25em"),
                ("margin-left", "2em"),
                ("color", "white")
            ]),
            onMouseOver(HeaderHover(MainButton)),
            onClick(HeaderClick(MainButton))
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
            onClick(HeaderClick(BlogButton)),
        ]}, [text("blog")])
    ])

let footer = state =>
    div([
        styles([
            ("background-color", "#2f302f"),
            ("padding", "2em"),
            ("display", "flex"),
            ("justify-content", "center"),
        ])
    ], [
        a(if state.hover == Some(GitHubFooter) {[
            onMouseOut(HeaderUnHover(GitHubFooter)),
            props([
                ("href", "https://github.com/n-arms")
            ]),
            styles([
                ("color", "#bee67e"),
                ("text-decoration", "none")
            ])
        ]} else {[
            onMouseOver(HeaderHover(GitHubFooter)),
            props([
                ("href", "https://github.com/n-arms")
            ]),
            styles([
                ("color", "white"),
                ("text-decoration", "none")
            ])
        ]}, [text("find me on GitHub")])
    ])

let title = _ =>
    div([
        styles([
            ("background-color", "#2f302f"),
            ("display", "flex"),
            ("flex-wrap", "wrap"),
            ("justify-content", "center"),
        ])
    ], [
        div([
            styles([
                ("padding-left", "2rem"),
            ])
        ], [
            h1([
                styles([
                    ("color", "#bee67e"),
                    ("font-size", "5em"),
                ])
            ], [
                text("n-arms")
            ]),
            p([
                styles([
                    ("color", "white"),
                    ("font-size", "2em")
                ])
            ], [
                text("a high school student trying to find their way in the world of tech")
            ])
        ]),
        div([
            styles([
                ("padding-left", "2rem"),
                ("display", "flex"),
                ("justify-content", "center"),
                ("align-content", "center"),
                ("flex-direction", "column"),
                ("color", "white"),
                ("font-size", "1.25em"),
            ])
        ], [
        ])
    ])

let main = state => div([], [
    title(state),
    div([
        props([
            ("id", "content")
        ])
    ], [
        ("f5 run file", "A plugin for the atom text editor that allows you to run your code just by hitting f5", text("img here")),
        ("Stalwart", "The custom frontend web framework that powers this website. Inspired by elm's html library", text("img here")),
        ("Neural Combinators", "Experiments with combining neural networks and functional programming", text("img here")),
        ("CBreakable", "A lightweight tool for building terminal user interfaces in golang", text("img here"))
    ] -> Array.map(((title, content, img)) => (div([
        styles([
            ("padding-left", "2rem"),
            ("flex-basis", "auto"),
            ("width", "40%")
        ])
    ], [
        h1([], [text(title)]),
        p([], [text(content)])
    ]), div([
        styles([
            ("padding-left", "2rem"),
            ("flex-basis", "auto"),
            ("width", "40%")
        ])
    ], [img]))) -> alternate
)])

let blog = _ => div([], 
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    -> Js.Array2.map(n => (
        div([
            styles([
                ("padding", "3em")
            ])
        ], [
            text(`blog article ${n -> Int.toString}`)
        ]),
        div([
            styles([
                ("padding", "3em")
            ])
        ], [
            text("image")
        ])))
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
    },
    footer(state)
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
