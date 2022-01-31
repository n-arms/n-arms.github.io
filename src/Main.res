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
            ("flex-direction", "column")
        ])
    ], [
        outline([
            centered([
                content("find me on"),
                inlineLink(text(" GitHub "), Some("https://github.com/n-arms"), GitHubFooter, state)
            ])
        ]),
        outline([
            centered([
            content("this website is powered by the "),
            inlineLink(
                text("Stalwart Engine"),
                Some("https://github.com/n-arms/stalwart"), 
                StalwartFooter, 
                state,
            ),
            text(` (written by yours truly), and has been online for ${(Js.Date.now() /. 60000. -. 27352806.) -> Js.Math.round -> Float.toString} minutes`)
            ])
        ])
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
        ("Neural Combinators", "Experiments with combining neural networks and functional programming", img([props([("src", "../resources/neural-net.svg")])])),
        ("CBreakable", "A lightweight tool for building terminal user interfaces in golang", text("img here"))
    ] -> Array.map(((title, description, img)) => (div([
        styles([
            ("padding-left", "2rem"),
            ("flex-basis", "auto"),
            ("width", "40%")
        ])
    ], [
        h1([], [text(title)]),
        p([], [text(description)])
    ]), div([
        styles([
            ("padding-left", "2rem"),
            ("flex-basis", "auto"),
            ("width", "40%")
        ])
    ], [img]))) -> alternate
)])

let blog = state => div([
    styles([
        ("padding", "3em"),
        ("background", "white"),
        ("color", "black")
    ])
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

let error404 = _ => text("error: 404")

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
        | BlogPost(i) => blogPost(state, i)
        | Error404 => error404(state)
    },
    footer(state)
])

let update = (msg, state) => {
    switch msg {
        | HeaderHover(target) => {
            {...state, hover: Some(target)}
        }
        | HeaderUnHover(target) => {
            {...state, hover: None}
        }
        | HeaderClick(target) => {
            location -> Location.setHash(switch target {
                | BlogButton => "blog"
                | MainButton => ""
                | BlogPost(i) => "post_" ++ i
            })
            state.loadedPosts -> HashMap.String.forEach((_, post) => Js.log(post))
            {
                ...state,
                page: target, 
                hover: Some(target), 
                loadedPosts: if target == BlogButton && state.loadedPosts -> HashMap.String.size == 0 {
                    "./pages/manifest.json" 
                    -> request 
                    -> parseManifest
                    -> manifest => manifest.pages
                    -> Array.map(page => (Js.String.replaceByRe(%re("/[ ]/g"), "-", page.title), {
                        ...page,
                        src: request("./pages/" ++ page.src)
                    }))
                    -> HashMap.String.fromArray
                } else {
                    state.loadedPosts
                }
            }
        }
    }
}

mainloop(root, init(), update, view)
