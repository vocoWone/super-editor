import {Editor, Transforms, Text, Element, Node} from "slate";
import {ReactEditor} from "slate-react";

export default class ToolBar {
    private editor: Editor & ReactEditor;
    constructor(editor: Editor & ReactEditor) {
        this.editor = editor;
    }

    isBold() {
        const [match] = Editor.nodes(this.editor, {
            match: (_: Node) => !!_.bold,
            universal: true,
        });
        return !!match;
    }

    isItalic() {
        const [match] = Editor.nodes(this.editor, {
            match: (_: Node) => !!_.italic,
            universal: true,
        });
        return !!match;
    }

    isCodeBlock() {
        const [match] = Editor.nodes(this.editor, {
            match: (_: Node) => _.type === "code",
        });
        return !!match;
    }

    isUnderLine() {
        const [match] = Editor.nodes(this.editor, {
            match: (_: Node) => !!_.underline,
            universal: true,
        });
        return !!match;
    }

    hasLineThrough() {
        const [match] = Editor.nodes(this.editor, {
            match: (_: Node) => !!_.lineThrough,
            universal: true,
        });
        return !!match;
    }

    isImageElement(value: Node) {
        return Element.isElement(value) && value.type === "image";
    }

    toggleBold() {
        const isBold = this.isBold();
        Transforms.setNodes(
            this.editor,
            {bold: isBold ? null : true},
            {
                match: (_: Node) => Text.isText(_),
                split: true,
            }
        );
    }

    toggleItalic() {
        const isItalic = this.isItalic();
        Transforms.setNodes(this.editor, {italic: isItalic ? null : true}, {match: (_: Node) => Text.isText(_), split: true});
    }

    toggleCodeBlock() {
        const isCodeBlock = this.isCodeBlock();
        Transforms.setNodes(this.editor, {type: isCodeBlock ? null : "code"}, {match: (_: Node) => Editor.isBlock(this.editor, _)});
    }

    toggleUnderLine() {
        const isUnderLine = this.isUnderLine();
        Transforms.setNodes(
            this.editor,
            {
                underline: isUnderLine ? null : true,
                lineThrough: null,
            },
            {match: (_: Node) => Text.isText(_), split: true}
        );
    }

    toggleLineThrough() {
        const hasLineThrough = this.hasLineThrough();
        Transforms.setNodes(
            this.editor,
            {
                lineThrough: hasLineThrough ? null : true,
                underline: null,
            },
            {match: (_: Node) => Text.isText(_), split: true}
        );
    }

    format() {
        Transforms.setNodes(
            this.editor,
            {
                bold: null,
                italic: null,
                lineThrough: null,
                type: null,
                underline: null,
            },
            {match: (_: Node) => Text.isText(_), split: true}
        );
    }

    changeTextLeft() {
        Transforms.setNodes(this.editor, {type: "left"}, {match: (_: Node) => Editor.isBlock(this.editor, _)});
    }

    changeTextCenter() {
        Transforms.setNodes(this.editor, {type: "center"}, {match: (_: Node) => Editor.isBlock(this.editor, _)});
    }

    changeTextRight() {
        Transforms.setNodes(this.editor, {type: "right"}, {match: (_: Node) => Editor.isBlock(this.editor, _)});
    }

    delete() {
        Transforms.setPoint(this.editor, {path: [0, 0], offset: 0}, {});
        Transforms.delete(this.editor);
    }

    insertImage(url: string) {
        const element = {
            type: "image",
            url,
            children: [{text: ""}],
        };
        Transforms.insertNodes(this.editor, element);
    }

    lineBreak() {
        const element = {type: "paragraph", children: [{text: ""}]};
        Transforms.insertNodes(this.editor, element);
    }
}
