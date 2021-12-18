mod markdown;
use std::fs;
use std::env;

fn main() {
    let mut args = env::args();
    if args.len() != 2 {
        return println!("Usage: build-page FILE");
    }
    let fp = args.next_back().unwrap();

    if let Ok(file) = fs::read(fp) {
        let tree = markdown::parser::parse_markdown(file.into_iter().map(|x| x as char).collect::<Vec<_>>().as_slice());
        match tree {
            Ok(tree) => for node in tree {
                println!("{}", node)
            },
            Err(e) => println!("parsing error: {:?}", e)
        }
    } else {
        println!("Please specify a valid file");
    }
}
