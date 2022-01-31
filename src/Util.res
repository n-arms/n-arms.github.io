open Stalwart.Attribute
open Stalwart.Node
open Stalwart.Mainloop 
open State
open Belt

// if we are given a url we don't send HeaderClick, if we aren't we do
let link = (html, url, button_name, state, isReversed, isDark) =>
    a(if state.hover == Some(button_name) {
        switch url {
        | Some(url) => [
            onMouseOut(HeaderUnHover(button_name)),
            props([
                ("href", url)
            ]),
            styles([
                ("color", if isReversed {if isDark {"black"} else {"white"}} else {"#bee67e"}),
                ("text-decoration", "none")
            ])
        ]
        | None => [
            onMouseOut(HeaderUnHover(button_name)),
            onClick(HeaderClick(button_name)),
            styles([
                ("color", if isReversed {if isDark {"black"} else {"white"}} else {"#bee67e"}),
                ("text-decoration", "none")
            ])
        ]
        }
    } else {[
        onMouseOver(HeaderHover(button_name)),
        styles([
            ("color", if isReversed {"#bee67e"} else {if isDark {"black"} else {"white"}}),
            ("text-decoration", "none")
        ])
    ]}, [
        html
    ])

let inlineLink = (html, url, button_name, state) => link(html, url, button_name, state, true, false)
/*
let alternate: array<(html<'a>, html<'a>)> => array<html<'a>> = c => {
    let side = ref(false)
    c
    -> Array.map(((picture, text)) => {
        picture
    })
}
*/
let alternate : array<(html<'a>, html<'a>)> => array<html<'a>> = contents => {
    let side = ref(false)
    contents
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

let content = words => div([
    styles([
        ("color", "white")
    ])
], [
    text(words)
])

let centered = contents => div([
    styles([
        ("display", "flex"),
        ("justify-content", "center"),
        ("flex-direction", "column")
    ])
], contents)

let outline = contents => p([], contents)
