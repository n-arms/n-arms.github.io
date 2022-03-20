use std::fmt;

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub enum MarkLiteral {
    PlainText(String),
    Bold(String),
    Italics(String),
    Header(String, u8),
    Inline(String),
    CodeBlock(Option<String>, String),
}

impl fmt::Display for MarkLiteral {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::PlainText(t) => write!(f, "{}", t),
            Self::Bold(t) => write!(f, "<b>\n{}\n</b>", t),
            Self::Italics(t) => write!(f, "<i>\n{}\n</i>", t),
            Self::Header(t, s) => write!(f, "<h{}>\n{}\n</h{}>", s, t, s),
            Self::Inline(t) => write!(f, "{}", t),
            Self::CodeBlock(Some(head), code) => write!(
                f,
                "<div class=\"code-block\">
<div class=\"code-header\">
{}
</div>
<div class=\"code-content\">
{}
</div>
</div>",
                head, code
            ),
            Self::CodeBlock(None, code) => write!(
                f,
                "<div class=\"code-block\">
<div class=\"code-content\">
{}
</div>
</div>",
                code
            ),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub enum MarkNode {
    UnOrdList(Vec<Vec<MarkLiteral>>),
    OrdList(Vec<Vec<MarkLiteral>>),
    Lit(MarkLiteral),
}

impl fmt::Display for MarkNode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Lit(l) => write!(f, "{}", l),
            Self::UnOrdList(ulist) => {
                writeln!(f, "<ul>")?;
                for lits in ulist {
                    writeln!(f, "<li>")?;
                    for lit in lits {
                        writeln!(f, "{}", lit)?;
                    }
                    writeln!(f, "</li>")?;
                }
                write!(f, "</ul>")
            }
            Self::OrdList(ulist) => {
                writeln!(f, "<ol>")?;
                for lits in ulist {
                    writeln!(f, "<li>")?;
                    for lit in lits {
                        writeln!(f, "{}", lit)?;
                    }
                    writeln!(f, "</li>")?;
                }
                write!(f, "</ol>")
            }
        }
    }
}
