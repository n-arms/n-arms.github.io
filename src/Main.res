open Belt
open Webapi.Dom
open Stalwart.Attribute
open Stalwart.Node
open Stalwart.Mainloop 
open Util
open State

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

let header = state =>
    styled_div([
        ("position", "sticky"),
        ("color", "#bee67e"),
        ("background-color", "rgba(32, 32, 32, 0.8)"),
        ("top", "0"),
        ("margin", "0"),
        ("display", "flex")
    ], [
        link(h1([
            styles([
                ("margin", "0.25em"),
                ("margin-left", "2em"),
            ]),
        ], [text("n-arms")]), None, MainButton, state, false, false),
        link(p([
            styles([
                ("margin", "1em"),
                ("margin-left", "3em"),
                ("font-size", "1.2em")
            ])
        ], [text("blog")]), None, BlogButton, state, false, false),
    ])

let footer = state =>
    div([
        styles([
            ("background-color", "#2f302f"),
            ("padding", "2em"),
            ("display", "flex"),
            ("justify-content", "center"),
            ("flex-direction", "column"),
            ("min-height", "15vh")
        ])
    ], [
        outline([
            centered([
                text("find me on"),
                inlineLink(text(" GitHub "), Some("https://github.com/n-arms"), GitHubFooter, state)
            ])
        ]),
        centered([
            text("this website is powered by the "),
            inlineLink(
                text("Stalwart Engine"),
                Some("https://github.com/n-arms/stalwart"), 
                StalwartFooter, 
                state,
            ),
            text({
                let rem = %raw("(a, b) => a % b")
                let time_ellapsed = Js.Date.now() /. 1000. -. 1643667192.;
                let seconds = rem(Js.Math.round(time_ellapsed), 60.) -> Float.toString
                let minutes = rem(Js.Math.round(time_ellapsed /. 60.), 60.) -> Float.toString
                let hours = rem(Js.Math.round(time_ellapsed /. 3600.), 24.) -> Float.toString
                let days = Js.Math.round(time_ellapsed /. 86400.) -> Float.toString
                ` (written by yours truly), and has been online for ${seconds} seconds, ${minutes} minutes, ${hours} hours, and ${days} days`
            })
        ])
    ])

let title = _ =>
    styled_div([
        ("background-color", "#2f302f"),
        ("display", "flex"),
        ("flex-wrap", "wrap"),
        ("justify-content", "center"),
    ], [
        styled_div([
            ("padding-left", "2rem"),
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
        styled_div([
            ("padding-left", "2rem"),
            ("display", "flex"),
            ("justify-content", "center"),
            ("align-content", "center"),
            ("flex-direction", "column"),
            ("color", "white"),
            ("font-size", "1.25em"),
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
        ("Neural Combinators", "Experiments with combining neural networks and functional programming", img([props([("src", "../resources/neural-net.svg")])])),
        ("CBreakable", "A lightweight tool for building terminal user interfaces in golang", text("img here"))
    ] -> Array.map(((title, description, img)) => (styled_div([
        ("padding-left", "2rem"),
        ("flex-basis", "auto"),
        ("width", "40%")
    ], [
        h1([], [text(title)]),
        p([], [text(description)])
    ]), styled_div([
        ("padding-left", "2rem"),
        ("flex-basis", "auto"),
        ("width", "40%")
    ], [img]))) -> alternate
)])

let blog = state => styled_div([
    ("padding", "3em"),
    ("background", "white"),
    ("color", "black")
], [
    h1([], [text("Previous Posts")]),
    div([], state.loadedPosts
        -> HashMap.String.toArray
        -> Array.map(((i, page)) => div([], [
            h2([], [link(text(page.title), None, BlogPost(i), state, false, true)]),
            p([], [text(`published ${page.date}`)])
        ]))
    )
])

let blogPost = (state, i) => div([
    styles([
        ("background", "white"),
        ("padding", "3em")
    ])
], {
    let firstPost = state.loadedPosts -> HashMap.String.get(i)
    switch firstPost {
        | Some(p) => [literal(p.src)]
        | None => {
            Js.log(`encountered error when trying to get post ${i} from state:`)
            Js.log(state)
            [[]][1] -> Option.getExn
        }
    }
})

let error404 = _ => content("error: 404")

let view = state => styled_div([
    ("id", "content"),
    ("background-color", "#2f302f"),
    ("margin", "0"),
], [
    header(state),
    styled_div([
        ("min-height", "70vh"),
        ("background-color", "white"),
    ], [
        switch state.page {
            | BlogButton => blog(state)
            | MainButton => main(state)
            | BlogPost(i) => blogPost(state, i)
            | _ => error404(state)
        }
    ]),
    styled_div([
        ("min-height", "30vh")
    ], [
        footer(state)
    ])
])

let update = (msg, state) => {
    switch msg {
        | HeaderHover(target) => {
            {...state, hover: Some(target)}
        }
        | HeaderUnHover(_) => {
            {...state, hover: None}
        }
        | HeaderClick(target) => {
            location -> Location.setHash(switch target {
                | BlogButton => "blog"
                | MainButton => ""
                | BlogPost(i) => "post_" ++ i
                | _ => location -> Location.hash
            })
            {
                ...state,
                page: target, 
                hover: Some(target), 
            }
        }
    }
}

mainloop(root, init(), update, view)
