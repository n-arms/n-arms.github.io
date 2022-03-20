mod markdown;
use serde::{Deserialize, Serialize};
use serde_json::to_string_pretty;
use std::env;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};

#[derive(Debug)]
pub enum Error {
    MarkdownOpen(String, io::Error),
    ParseError(String, markdown::parser::ParseError),
    HTMLWrite(String, io::Error),
    JsonParse(String, serde_json::Error),
    JsonSerialize(Manifest, serde_json::Error),
    ManifestOpen(String, io::Error),
    ManifestWrite(String, io::Error),
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Manifest {
    pages: Vec<Page>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Page {
    title: String,
    src: String,
    date: String,
}

#[derive(Debug)]
pub struct Config {
    markdown_path: String,
    manifest_path: String,
    html_path: String,
    html_src: String,
    title: String,
    date: String,
}

fn build_page(
    c: Config
) -> Result<(), Error> {
    println!("{:#?}", c);
    let markdown_file =
        fs::read(&c.markdown_path).map_err(|e| Error::MarkdownOpen(c.markdown_path.clone(), e))?;
    let tree = markdown::parser::parse_markdown(
        markdown_file
            .into_iter()
            .map(|x| x as char)
            .collect::<Vec<_>>()
            .as_slice(),
    )
    .map_err(|e| Error::ParseError(c.markdown_path.clone(), e))?;

    let buf: String = tree.into_iter().flat_map(|node| node.to_string().chars().collect::<Vec<_>>()).collect();
    fs::write(&c.html_path, buf)
        .map_err(|e| Error::HTMLWrite(c.html_path.clone(), e))?;

    let mut manifest: Manifest = serde_json::from_str(&String::from_utf8_lossy(
        &fs::read(&c.manifest_path).map_err(|e| Error::MarkdownOpen(c.manifest_path.clone(), e))?,
    ))
    .map_err(|e| Error::JsonParse(c.manifest_path.clone(), e))?;

    manifest.pages.push(Page {
        date: c.date.clone(),
        title: c.title.clone(),
        src: c.html_src.clone(),
    });

    fs::write(
        &c.manifest_path,
        to_string_pretty(&manifest).map_err(|e| Error::JsonSerialize(manifest.clone(), e))?,
    )
    .map_err(|e| Error::ManifestWrite(c.manifest_path.clone(), e))?;

    Ok(())
}

fn main() {
    let mut args = env::args();

    if args.len() != 5 {
        return println!("Usage: build-page PAGES SOURCE TITLE DATE");
    }

    args.next().unwrap();
    let pages_path = PathBuf::from(args.next().unwrap());
    let source_path = PathBuf::from(args.next().unwrap());
    let title = args.next().unwrap();
    let date = args.next().unwrap();

    let html_src = format!("{}.html", title);

    let mut manifest_path = pages_path.clone();
    manifest_path.push("manifest.json");
    
    let mut html_path = pages_path.clone();
    html_path.push(html_src.clone());

    build_page(Config {
        markdown_path: source_path.to_string_lossy().to_string(),
        manifest_path: manifest_path.to_string_lossy().to_string(),
        html_path: html_path.to_string_lossy().to_string(),
        html_src,
        title,
        date
    }).unwrap();
}
