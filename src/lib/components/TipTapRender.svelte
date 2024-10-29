<script lang="ts">
  import { mergeAttributes, type JSONContent } from '@tiptap/core'
  import { generateHTML } from '@tiptap/html'
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
  import TipTap from '$lib/components/TipTap.svelte'

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
  export let editMode = false
  export let editable = false
  export let handleSave: (payload: JSONContent) => void
</script>

{#if editable}
  <button
    class="p-2 my-2 text-md md:text-lg text-white bg-teal-500 hover:bg-teal-700 rounded-lg transition-all ease-in-out duration-200"
    onclick={() => (editMode = !editMode)}>{editMode ? 'Normal Mode' : 'Edit Mode'}</button
  >
{/if}
{#if editMode}
  <TipTap bind:content {handleSave} />
{:else}
  <div class="w-full text-gray-800">
    {@html generateHTML(content, [
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
            class: 'w-full'
          }
        },
        bulletList: {
          HTMLAttributes: {
            class: 'w-full'
          }
        },
        blockquote: {
          HTMLAttributes: {
            class: 'w-full italic text-lg'
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
          HTMLAttributes.class = HTMLAttributes.class ? `${HTMLAttributes.class} ${apsect}` : apsect
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
          class: 'table-fixed border-separate border-spacing-x-4 -mx-4'
        }
      }),
      TableHeader,
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: 'w-full md:w-1/2 table-row md:table-cell align-top'
        }
      })
    ])}
  </div>
{/if}
