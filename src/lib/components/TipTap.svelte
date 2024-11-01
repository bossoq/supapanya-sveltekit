<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Editor, mergeAttributes, type JSONContent } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import Heading from '@tiptap/extension-heading'
  import Underline from '@tiptap/extension-underline'
  import Link from '@tiptap/extension-link'
  import Image from '@tiptap/extension-image'
  import TextAlign from '@tiptap/extension-text-align'
  import Table from '@tiptap/extension-table'
  import TableRow from '@tiptap/extension-table-row'
  import TableCell from '@tiptap/extension-table-cell'
  import TableHeader from '@tiptap/extension-table-header'
  import Focus from '@tiptap/extension-focus'
  import BubbleMenu from '@tiptap/extension-bubble-menu'
  import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
  import { toastsList } from '$lib/store'

  export let content: JSONContent = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: {
          textAlign: 'left'
        },
        content: [
          {
            type: 'text',
            text: 'Hello World! 🌍️'
          }
        ]
      }
    ]
  }
  export let handleSave: (payload: JSONContent) => void
  export let autoSave = false
  let element: Element
  let bubbleLinkElement: HTMLElement
  let bubblePictureElement: HTMLElement
  let editor: Editor
  let showEditLink = false
  let showEditPicture = false
  let link = ''
  let file: File | undefined

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          heading: false,
          paragraph: {
            HTMLAttributes: {
              class: 'w-full'
            }
          },
          orderedList: {
            HTMLAttributes: {
              class: 'w-full list-decimal font-bold'
            }
          },
          bulletList: {
            HTMLAttributes: {
              class: 'w-full list-disc font-bold'
            }
          },
          blockquote: {
            HTMLAttributes: {
              class: 'w-full italic'
            }
          },
          horizontalRule: {
            HTMLAttributes: {
              class: 'w-full border-t-2 border-gray-800 my-4'
            }
          }
        }),
        Heading.extend({
          levels: [1, 2],
          renderHTML({ node, HTMLAttributes }) {
            const level = this.options.levels.includes(node.attrs.level)
              ? node.attrs.level
              : this.options.levels[0]
            const classes: { [index: number]: string } = {
              1: 'w-full text-2xl md:text-4xl text-gray-800 font-bold py-2',
              2: 'w-full text-xl md:text-3xl text-gray-800 font-semibold py-2'
            }
            return [
              `h${level}`,
              mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: `${classes[level]}`
              }),
              0
            ]
          }
        }).configure({
          levels: [1, 2]
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https://'
        }),
        Image.extend({
          addAttributes() {
            return {
              src: {
                default: null
              },
              alt: {
                default: null
              },
              title: {
                default: null
              },
              aspect: {
                default: null
              }
            }
          },
          renderHTML({ node, HTMLAttributes }) {
            const apsect = node.attrs.aspect ? `aspect-[${node.attrs.aspect}]` : ''
            HTMLAttributes.class = HTMLAttributes.class
              ? `${HTMLAttributes.class} ${apsect}`
              : apsect
            return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
          }
        }).configure({
          allowBase64: true,
          HTMLAttributes: {
            class: 'object-cover'
          }
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph']
        }),
        Table.configure({
          resizable: false,
          HTMLAttributes: {
            class: 'w-full table-fixed border-separate border-spacing-x-4 -mx-4'
          }
        }),
        TableHeader,
        TableRow,
        TableCell.configure({
          HTMLAttributes: {
            class: 'w-full md:w-1/2 table-row md:table-cell align-top'
          }
        }),
        Focus.configure({
          mode: 'all',
          className: 'border border-blue-500 rounded'
        }),
        BubbleMenu.configure({
          shouldShow: () => {
            link = editor.getAttributes('link').href || ''
            return showEditLink || editor.isActive('link')
          },
          updateDelay: 0,
          element: bubbleLinkElement,
          tippyOptions: {
            popperOptions: {
              modifiers: [
                {
                  name: 'flip',
                  enabled: false
                }
              ]
            },
            maxWidth: 450,
            appendTo: element,
            onHidden: () => {
              showEditLink = false
            }
          },
          pluginKey: 'bubbleMenuLink'
        }),
        BubbleMenu.configure({
          shouldShow: () => {
            return showEditPicture
          },
          updateDelay: 0,
          element: bubblePictureElement,
          tippyOptions: {
            popperOptions: {
              modifiers: [
                {
                  name: 'flip',
                  enabled: false
                }
              ]
            },
            maxWidth: 450,
            appendTo: element,
            onHidden: () => {
              showEditPicture = false
            }
          },
          pluginKey: 'bubbleMenuPicture'
        })
      ],
      content: content,
      editorProps: {
        attributes: {
          class:
            'flex flex-col items-center border-2 border-gray-800 rounded-b-lg p-4 focus:outline-none text-gray-800'
        }
      },
      onTransaction: () => {
        editor = editor
        if (autoSave) {
          handleSave(editor.getJSON())
        }
      },
      autofocus: 'start',
      editable: true
    })
  })
  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  })
  const button = [
    {
      icon: 'bold',
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
      isDisable: () => false
    },
    {
      icon: 'italic',
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
      isDisable: () => false
    },
    {
      icon: 'underline',
      title: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
      isDisable: () => false
    },
    {
      icon: 'strikethrough',
      title: 'Strikethrough',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
      isDisable: () => false
    },
    {
      icon: 'divider',
      title: 'Divider',
      action: () => null,
      isActive: () => false,
      isDisable: () => false
    },
    {
      icon: 'h-1',
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
      isDisable: () => false
    },
    {
      icon: 'h-2',
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
      isDisable: () => false
    },
    {
      icon: 'paragraph',
      title: 'Paragraph',
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive('paragraph'),
      isDisable: () => false
    },
    {
      icon: 'list-unordered',
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
      isDisable: () => false
    },
    {
      icon: 'list-ordered',
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
      isDisable: () => false
    },
    {
      icon: 'divider',
      title: 'Divider',
      action: () => null,
      isActive: () => false,
      isDisable: () => false
    },
    {
      icon: 'align-left',
      title: 'Align Left',
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: () => editor.isActive({ textAlign: 'left' }),
      isDisable: () => false
    },
    {
      icon: 'align-center',
      title: 'Align Center',
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: () => editor.isActive({ textAlign: 'center' }),
      isDisable: () => false
    },
    {
      icon: 'align-right',
      title: 'Align Right',
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: () => editor.isActive({ textAlign: 'right' }),
      isDisable: () => false
    },
    {
      icon: 'align-justify',
      title: 'Align Justify',
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: () => editor.isActive({ textAlign: 'justify' }),
      isDisable: () => false
    },
    {
      icon: 'divider',
      title: 'Divider',
      action: () => null,
      isActive: () => false,
      isDisable: () => false
    },
    {
      icon: 'layout-grid-line',
      title: 'Grid',
      action: () =>
        editor.chain().focus().insertTable({ rows: 1, cols: 2, withHeaderRow: false }).run(),
      isActive: () => editor.isActive('grid'),
      isDisable: () => false
    },
    {
      icon: 'divider',
      title: 'Divider',
      action: () => null,
      isActive: () => false,
      isDisable: () => false
    },
    {
      icon: 'double-quotes-l',
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
      isDisable: () => false
    },
    {
      icon: 'separator',
      title: 'Horizontal Rule',
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: () => false,
      isDisable: () => false
    },
    {
      icon: 'link',
      title: 'Link',
      action: () => {
        showEditLink = true
        editor.chain().focus().run()
      },
      isActive: () => editor.isActive('link'),
      isDisable: () => editor.view.state.selection.empty
    },
    {
      icon: 'image-add-line',
      title: 'Image',
      action: () => {
        showEditPicture = true
        editor.chain().focus().run()
      },
      isActive: () => false,
      isDisable: () => false
    },
    {
      icon: 'divider',
      title: 'Divider',
      action: () => null,
      isActive: () => false,
      isDisable: () => false
    },
    {
      icon: 'text-wrap',
      title: 'Hard Break',
      action: () => editor.chain().focus().setHardBreak().run(),
      isActive: () => false,
      isDisable: () => false
    },
    {
      icon: 'format-clear',
      title: 'Clear Format',
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
      isActive: () => false,
      isDisable: () => false
    },
    {
      icon: 'divider',
      title: 'Divider',
      action: () => null,
      isActive: () => false,
      isDisable: () => false
    },
    {
      icon: 'arrow-go-back-line',
      title: 'Undo',
      action: () => editor.chain().focus().undo().run(),
      isActive: () => false,
      isDisable: () => !editor.can().undo()
    },
    {
      icon: 'arrow-go-forward-line',
      title: 'Redo',
      action: () => editor.chain().focus().redo().run(),
      isActive: () => false,
      isDisable: () => !editor.can().redo()
    },
    {
      icon: 'save-3-line',
      title: 'Save',
      action: () => {
        const payload = editor.getJSON()
        content = payload
        handleSave(payload)
      },
      isActive: () => false,
      isDisable: () => !editor.can().undo()
    },
    {
      icon: 'refresh-line',
      title: 'Reset',
      action: () => editor.commands.setContent(content),
      isActive: () => false,
      isDisable: () => false
    }
  ]
</script>

<div
  bind:this={bubbleLinkElement}
  class="flex flex-row items-center justify-center gap-2 bg-gray-800 text-white p-1 rounded-lg shadow-lg"
  style="visibility: hidden;"
>
  <label for="link" class="text-white">Link: </label>
  <input
    id="link"
    type="url"
    pattern="https://.*"
    class="w-full p-1 bg-gray-800 text-white invalid:text-red-500"
    bind:value={link}
  />
  <button
    class="p-1 bg-gray-600 text-white rounded-lg"
    aria-label="Insert Link"
    disabled={link.match(/^https:\/\/.*/) === null && link !== ''}
    onclick={() => {
      if (link === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        showEditLink = false
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: link }).run()
        link = ''
        showEditLink = false
      }
    }}
  >
    <svg class="aspect-square w-5 text-green-500" fill="currentColor">
      <use xlink:href="{remixiconUrl}#ri-check-line" />
    </svg>
  </button>
</div>
<div
  bind:this={bubblePictureElement}
  class="flex flex-row items-center justify-center gap-2 bg-gray-800 text-white p-1 rounded-lg shadow-lg"
  style="visibility: hidden;"
>
  <input
    id="file"
    type="file"
    accept="image/png, image/jpeg, image/jpg, image/webp"
    class="w-full p-1 bg-gray-800 text-white invalid:text-red-500"
    onchange={(e) => {
      file = (e.target as HTMLInputElement).files?.[0]
    }}
  />
  <button
    class="p-1 bg-gray-600 text-white rounded-lg"
    aria-label="Upload Image"
    disabled={!file}
    onclick={async () => {
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('imageType', 'full')
        const response = await fetch('/api/processImage', {
          method: 'POST',
          body: formData
        })
        const { success, image }: { success: boolean; image: string } = await response.json()
        if (success) {
          editor.chain().focus().setImage({ src: image }).run()
        } else {
          toastsList.update((toasts) => [
            ...toasts,
            {
              uuid: Math.random().toString(36).substring(2),
              type: 'error',
              message: 'Failed to process image'
            }
          ])
        }
        showEditPicture = false
      } else {
        showEditPicture = false
      }
    }}
  >
    <svg class="aspect-square w-5 text-green-500" fill="currentColor">
      <use xlink:href="{remixiconUrl}#ri-check-line" />
    </svg>
  </button>
</div>
<div bind:this={element}>
  {#if editor}
    <div
      class="flex flex-wrap gap-1 border-l-2 border-r-2 border-t-2 bg-gray-800 border-gray-800 rounded-t-lg text-white p-1"
    >
      {#each button as { icon, title, action, isActive, isDisable }}
        {#if icon === 'divider'}
          <hr class="border-r border-white h-7 mx-0.5" />
        {:else}
          <button
            class="hover:bg-gray-600 p-1 rounded-lg transition-all ease-in-out duration-200 disabled:cursor-not-allowed disabled:text-gray-500 disabled:hover:bg-inherit"
            onclick={() => action()}
            class:bg-gray-600={isActive()}
            aria-label={title}
            {title}
            disabled={isDisable()}
          >
            <svg class="aspect-square w-5" fill="currentColor">
              <use xlink:href={remixiconUrl + '#ri-' + icon} />
            </svg>
          </button>
        {/if}
      {/each}
    </div>
  {/if}
</div>
