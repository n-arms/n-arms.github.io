macro_rules! at_least {
    ($text:expr, $count:expr) => {
        if $text.len() < $count {
            return Err(ParseError::UnexpectedEof);
        }
    }
}

use super::expr::{MarkLiteral, MarkNode, MarkLiteral::*, MarkNode::*};

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub enum ParseError {
    UnexpectedEof,
    ExpectedStar,
    ExpectedHash,
    ExpectedBacktick,
    ExpectedListEntry,
    Todo
}

pub fn parse_markdown<'a>(text: &'a [char]) -> Result<Vec<MarkNode>, ParseError> {
    let mut rest = text;
    let mut nodes = Vec::new();
    while rest.len() > 0 {
        let (node, text) = parse_node(rest)?;
        rest = strip_while(vec![' ', '\n'], text);
        nodes.push(node);
    }
    Ok(nodes)
}

fn strip_while<'a>(chars: Vec<char>, text: &'a [char]) -> &'a [char] {
    let mut out = text;
    while out.len() != 0 && chars.contains(&out[0]) {
        out = &out[1..];
    }
    out
}

fn parse_plain<'a>(text: &'a [char]) -> Result<(String, &'a [char]), ParseError> {
    let mut rest = text;
    let mut out = String::new();
    while rest.len() > 0 && rest[0] != '#' && rest[0] != '`' && rest[0] != '*' && rest[0] != '\n' && rest[0] != '-' {
        out.push(rest[0]);
        rest = &rest[1..];
    }
    if out.len() == 0 {
        Err(ParseError::UnexpectedEof)
    } else {
        Ok((out, rest))
    }
}

fn parse_italics<'a>(text: &'a [char]) -> Result<(String, &'a [char]), ParseError> {
    at_least!(text, 3);
    if text[0] != '*' {
        return Err(ParseError::ExpectedStar);
    }
    let (plain, text) = parse_plain(&text[1..])?;
    at_least!(text, 1);
    if text[0] != '*' {
        Err(ParseError::ExpectedStar)
    } else {
        Ok((plain, &text[1..]))
    }
}

fn parse_bold<'a>(text: &'a [char]) -> Result<(String, &'a [char]), ParseError> {
    at_least!(text, 5);
    if text[0] != '*' || text[1] != '*' {
        return Err(ParseError::ExpectedStar);
    }
    let (plain, text) = parse_plain(&text[2..])?;
    at_least!(text, 2);
    if text[0] != '*' || text[1] != '*' {
        Err(ParseError::ExpectedStar)
    } else {
        Ok((plain, &text[2..]))
    }
}

fn parse_header<'a>(text: &'a [char]) -> Result<(String, u8, &'a [char]), ParseError> {
    let mut hash_count : u8 = 0;
    while text.len() > hash_count as usize + 1 && text[hash_count as usize] == '#' {
        hash_count += 1;
    }
    if hash_count == 0 {
        Err(ParseError::ExpectedHash)
    } else {
        let (plain, text) = parse_plain(&text[hash_count as usize..])?;
        Ok((plain, hash_count, text))
    }
}

fn parse_code_block<'a>(text: &'a [char]) -> Result<(Option<String>, String, &'a [char]), ParseError> {
    at_least!(text, 6);
    if text[0] != '`' || text[1] != '`' || text[2] != '`' {
        return Err(ParseError::ExpectedBacktick);
    }
    let mut rest = &text[3..];
    let mut header = String::new();
    let mut content = String::new();
    while rest.len() > 3 && !(rest[0] == '`' && rest[1] == '`' && rest[2] == '`') {
        if content.len() > 0 {
            content.push(rest[0]);
        } else if rest[0] == '\n' {
            content.push(rest[0]);
        } else {
            header.push(rest[0]);
        }
        rest = &rest[1..];
    }
    if rest.len() < 3 {
        Err(ParseError::ExpectedBacktick)
    } else if content.len() == 0 {
        Ok((None, header, &rest[3..]))
    } else {
        Ok((Some(header), content, &rest[3..]))
    }
}

fn parse_lit<'a>(text: &'a [char]) -> Result<(MarkLiteral, &'a [char]), ParseError> {
    parse_header(text)
        .map(|(header, size, text)| {
            (Header(header, size), text)
        }).or_else(|_| {
            let (contents, text) = parse_bold(text)?;
            Ok((Bold(contents), text))
        }).or_else(|_: ParseError| {
            let (contents, text) = parse_italics(text)?;
            Ok((Italics(contents), text))
        }).or_else(|_: ParseError| match parse_code_block(text) {
            Ok((Some(header), content, text)) if &header == "inline" => Ok((Inline(content), text)),
            Ok((header, content, text)) => Ok((CodeBlock(header, content), text)),
            Err(e) => Err(e)
        }).or_else(|_| {
            let (contents, text) = parse_plain(text)?;
            Ok((PlainText(contents), text))
        })
}

fn parse_node<'a>(text: &'a [char]) -> Result<(MarkNode, &'a [char]), ParseError> {
    parse_ulist(text)
        .map(|(ulist, text)| 
             (UnOrdList(ulist), text)
        ).or_else(|_| {
            let (olist, text) = parse_olist(text)?;
            Ok((OrdList(olist), text))
        }).or_else(|_: ParseError| {
            let (lit, text) = parse_lit(text)?;
            Ok((Lit(lit), text))
        })
}

fn parse_ulist<'a>(text: &'a [char]) -> Result<(Vec<Vec<MarkLiteral>>, &'a [char]), ParseError> {
    let mut nodes = Vec::new();
    let mut rest = text;
    while rest.len() > 1 && rest[0] == '-' {
        let mut current = Vec::new();
        rest = strip_while(vec![' '], &rest[1..]);
        while rest.len() > 1 && rest[0] != '-' { 
            match parse_lit(rest) {
                Ok((node, text)) =>{
                    rest = strip_while(vec![' '], text);
                    current.push(node);
                },
                Err(e) => return Err(e)
            }
            rest = strip_while(vec![' ', '\n'], &rest[1..]);
        }
        nodes.push(current);
    }
    if nodes.len() == 0 {
        Err(ParseError::ExpectedListEntry)
    } else {
        Ok((nodes, rest))
    }
}

fn parse_olist<'a>(text: &'a [char]) -> Result<(Vec<Vec<MarkLiteral>>, &'a [char]), ParseError> {
    Err(ParseError::Todo)
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn plain() {
        assert_eq!(
            parse_plain(&['1', '2', '3', ' ', '\n', '4']), 
            Ok((String::from("123 "), vec!['\n', '4'].as_slice())));
        assert_eq!(
            parse_plain(&['1', '2', '3', ' ', '*', '4']), 
            Ok((String::from("123 "), vec!['*', '4'].as_slice())));
        assert_eq!(
            parse_plain(&['1', '2', '3', ' ', '#', '4']), 
            Ok((String::from("123 "), vec!['#', '4'].as_slice())));
        assert_eq!(
            parse_plain(&['1', '2', '3', ' ', '`', '4']), 
            Ok((String::from("123 "), vec!['`', '4'].as_slice())));
    }

    #[test]
    fn bold() {
        assert_eq!(
            parse_bold(&['*', '*', '1', '*', '*', '2']), 
            Ok((String::from("1"), vec!['2'].as_slice())));
    }

    #[test]
    fn italics() {
        assert_eq!(
            parse_italics(&['*', '1', '*', '2']), 
            Ok((String::from("1"), vec!['2'].as_slice())));
    }

    #[test]
    fn header() {
        assert_eq!(
            parse_header(&['#', '1', '\n', '2']), 
            Ok((String::from("1"), 1, vec!['\n', '2'].as_slice())));
        assert_eq!(
            parse_header(&['#', '#', '#', '1', '\n', '2']), 
            Ok((String::from("1"), 3, vec!['\n', '2'].as_slice())));
    }

    #[test]
    fn code_block() {
        assert_eq!(
            parse_code_block(&['`', '`', '`', '1', '`', '`', '`', '2']),
            Ok((None, String::from("1"), vec!['2'].as_slice())));
        assert_eq!(
            parse_code_block(&['`', '`', '`', '1', '\n', '2', '`', '`', '`', '3']),
            Ok((Some(String::from("1")), String::from("\n2"), vec!['3'].as_slice())));
    }

    #[test]
    fn lit() {
        assert_eq!(
            parse_lit(&['1', '2', '3', '\n']),
            Ok((PlainText(String::from("123")), vec!['\n'].as_slice())));
        assert_eq!(
            parse_lit(&['#', '1', '\n']),
            Ok((Header(String::from("1"), 1), vec!['\n'].as_slice())));
        assert_eq!(
            parse_lit(&['*', '1', '*', '\n']),
            Ok((Italics(String::from("1")), vec!['\n'].as_slice())));
        assert_eq!(
            parse_lit(&['*', '*', '1', '*', '*', '\n']),
            Ok((Bold(String::from("1")), vec!['\n'].as_slice())));
        assert_eq!(
            parse_lit(&['`', '`', '`', '1', '`', '`', '`', '\n']),
            Ok((CodeBlock(None, String::from("1")), vec!['\n'].as_slice())));
        assert_eq!(
            parse_lit(&['`', '`', '`', '1', '\n', '2', '`', '`', '`', '\n']),
            Ok((CodeBlock(Some(String::from("1")), String::from("\n2")), vec!['\n'].as_slice())));
    }

    #[test]
    fn node() {
        assert_eq!(
            parse_node(&['#', '1', '\n', '2']),
            Ok((Lit(Header(String::from("1"), 1)), vec!['\n', '2'].as_slice())));
        assert_eq!(
            parse_node(&['-', ' ', '1', '\n', '-', ' ', '2', '\n', '3']),
            Ok((UnOrdList(vec![vec![PlainText(String::from("1"))], vec![PlainText(String::from("2"))]]), vec!['3'].as_slice())));
    }

    #[test]
    fn complete_parse() {
        assert_eq!(
            parse_markdown(&['#', '1', '\n', '#', '2', '\n', '3']),
            Ok(vec![Lit(Header(String::from("1"), 1)), Lit(Header(String::from("2"), 1)), Lit(PlainText(String::from("3")))]));
    }
}
