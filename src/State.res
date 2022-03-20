open Belt
open Webapi.Dom

type button
    = BlogButton
    | MainButton
    | GitHubFooter
    | StalwartFooter
    | BlogPost(string)
    | Error404

type appMsg
    = HeaderHover(button)
    | HeaderUnHover(button)
    | HeaderClick(button)

type post = {title: string, src: string, date: string}
type manifest = {pages: array<post>}

type appState = {
    page: button,
    hover: option<button>,
    loadedPosts: HashMap.String.t<post>,
    manifest: manifest
}

let request = %raw(`
    filePath => {
        const request = new XMLHttpRequest()
        request.open("GET", filePath, false)
        request.send()
        if (request.status == 200) {
            return request.responseText
        }
    }
`)

@scope("JSON") @val
external parseManifest: string => manifest = "parse"

let parseHash: string => button = hash => switch hash {
    | "" => MainButton
    | "#main" => MainButton
    | "#blog" => BlogButton
    | h => 
        if h -> Js.String.length >= 7 {
            BlogPost(h -> Js.String.substringToEnd(~from=6))
        } else {
            Error404
        }
}

let init = () => {
    let page = parseHash(location -> Location.hash)
    let manifest = "./pages/manifest.json"
        -> request
        -> parseManifest
    let loadedPosts = manifest.pages
        -> Array.map(page => (page.title -> Js.String2.replaceByRe(%re("/[ ]/g"), "-"), {
            ...page,
            src: request("./pages/" ++ page.src)
        }))
        -> HashMap.String.fromArray
    {page, hover: None, loadedPosts, manifest}
}
