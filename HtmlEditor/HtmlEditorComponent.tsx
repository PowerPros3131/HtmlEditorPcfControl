import * as React from "react";
import { useEffect, useRef } from "react";

// Quill will be loaded dynamically in the component
declare var Quill: any;

export interface HtmlEditorProps {
    htmlContent: string;
    onHtmlChange: (htmlContent: string) => void;
    disabled: boolean;
}

export const HtmlEditorComponent = (props: HtmlEditorProps) => {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<any>(null);
    const { htmlContent, onHtmlChange, disabled } = props;

    // Initialize the editor
    useEffect(() => {
        // Load Quill scripts if they haven't been loaded yet
        if (!window.document.getElementById("quill-script")) {
            loadQuillDependencies().then(() => {
                initializeQuillEditor();
            });
        } else {
            initializeQuillEditor();
        }

        return () => {
            // Cleanup if needed - nothing specific required for Quill
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update editor content when htmlContent changes
    useEffect(() => {
        if (quillInstance.current && htmlContent !== getEditorContent()) {
            quillInstance.current.root.innerHTML = htmlContent;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [htmlContent]);

    // Update disabled state
    useEffect(() => {
        if (quillInstance.current) {
            quillInstance.current.enable(!disabled);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled]);

    const loadQuillDependencies = async (): Promise<void> => {
        return new Promise((resolve) => {
            // Load Quill CSS
            const quillCss = document.createElement("link");
            quillCss.rel = "stylesheet";
            quillCss.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
            quillCss.id = "quill-css";
            document.head.appendChild(quillCss);

            // Load Quill JS
            const quillScript = document.createElement("script");
            quillScript.src = "https://cdn.quilljs.com/1.3.6/quill.min.js";
            quillScript.id = "quill-script";
            quillScript.onload = () => resolve();
            document.body.appendChild(quillScript);
        });
    };

    const initializeQuillEditor = (): void => {
        if (!editorContainerRef.current || quillInstance.current) return;
        
        // Register Font module for additional fonts
        if (typeof Quill !== 'undefined') {
            const Font = Quill.import('formats/font');
            Font.whitelist = [
                'arial', 
                'calibri', 
                'cambria',
                'comic-sans',
                'courier-new',
                'georgia', 
                'helvetica',
                'lucida',
                'tahoma',
                'times-new-roman',
                'trebuchet-ms',
                'verdana'
            ];
            Quill.register(Font, true);
        }

        // Toolbar options with color and background restored
        const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 
                'font': [
                    'arial', 
                    'calibri', 
                    'cambria',
                    'comic-sans',
                    'courier-new',
                    'georgia', 
                    'helvetica',
                    'lucida',
                    'tahoma',
                    'times-new-roman',
                    'trebuchet-ms',
                    'verdana'
                ] 
            }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image']
        ];

        // Initialize Quill with color and background formats restored
        quillInstance.current = new Quill(editorContainerRef.current, {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow',
            readOnly: disabled,
            formats: [
                'bold', 'italic', 'underline', 'strike',
                'color', 'background',
                'font', 'size',
                'link', 'image',
                'align', 'indent',
                'list', 'bullet',
                'script', 'header',
                'blockquote', 'code-block',
                'direction'
            ]
        });

        // Set initial content
        quillInstance.current.root.innerHTML = htmlContent;

        // Listen for content changes - simplified without paragraph processing
        quillInstance.current.on('text-change', () => {
            const content = getEditorContent();
            onHtmlChange(content);
        });

        // Add custom CSS for font families
        addCustomFontStyles();
    };

    // Function to add custom font styles to the document
    const addCustomFontStyles = () => {
        if (!document.getElementById('quill-custom-fonts')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'quill-custom-fonts';
            styleEl.innerHTML = `
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
                    content: 'Arial';
                    font-family: 'Arial', sans-serif;
                }
                .ql-font-arial {
                    font-family: 'Arial', sans-serif;
                }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="calibri"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="calibri"]::before {
                    content: 'Calibri';
                    font-family: 'Calibri', sans-serif;
                }
                .ql-font-calibri {
                    font-family: 'Calibri', sans-serif;
                }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="cambria"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="cambria"]::before {
                    content: 'Cambria';
                    font-family: 'Cambria', serif;
                }
                .ql-font-cambria {
                    font-family: 'Cambria', serif;
                }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="comic-sans"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="comic-sans"]::before {
                    content: 'Comic Sans';
                    font-family: 'Comic Sans MS', cursive;
                }
                .ql-font-comic-sans {
                    font-family: 'Comic Sans MS', cursive;
                }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before {
                    content: 'Courier New';
                    font-family: 'Courier New', monospace;
                }
                .ql-font-courier-new {
                    font-family: 'Courier New', monospace;
                }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before {
                    content: 'Georgia';
                    font-family: 'Georgia', serif;
                }
                .ql-font-georgia {
                    font-family: 'Georgia', serif;
                }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="helvetica"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="helvetica"]::before {
                    content: 'Helvetica';
                    font-family: 'Helvetica', sans-serif;
                }
                .ql-font-helvetica {
                    font-family: 'Helvetica', sans-serif;
                }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="lucida"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="lucida"]::before {
                    content: 'Lucida';
                    font-family: 'Lucida Sans Unicode', sans-serif;
                }
                .ql-font-lucida {
                    font-family: 'Lucida Sans Unicode', sans-serif;
                }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="tahoma"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="tahoma"]::before {
                    content: 'Tahoma';
                    font-family: 'Tahoma', sans-serif;
                }
                .ql-font-tahoma {
                    font-family: 'Tahoma', sans-serif;
                }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
                    content: 'Times New Roman';
                    font-family: 'Times New Roman', serif;
                }
                .ql-font-times-new-roman {
                    font-family: 'Times New Roman', serif;
                }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="trebuchet-ms"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="trebuchet-ms"]::before {
                    content: 'Trebuchet MS';
                    font-family: 'Trebuchet MS', sans-serif;
                }
                .ql-font-trebuchet-ms {
                    font-family: 'Trebuchet MS', sans-serif;
                }
                
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before {
                    content: 'Verdana';
                    font-family: 'Verdana', sans-serif;
                }
                .ql-font-verdana {
                    font-family: 'Verdana', sans-serif;
                }
            `;
            document.head.appendChild(styleEl);
        }
    };

    // Get the content from Quill
    const getEditorContent = (): string => {
        return quillInstance.current ? quillInstance.current.root.innerHTML : '';
    };

    return (
        <div className="html-editor-container" style={{ width: '100%', height: '100%' }}>
            <div ref={editorContainerRef} style={{ height: 'calc(100% - 42px)', minHeight: '200px' }}></div>
        </div>
    );
};