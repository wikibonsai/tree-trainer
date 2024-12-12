<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import mermaid from 'mermaid';
  import { theme } from '$lib/util/store';
  import { appendStyles } from '$lib/util/prompt';

  export let markdown: string = '';
  export let height: number = 100;
  export let width: number = 100;

  let container: HTMLDivElement;
  let currentMarkdown: string = '';
  let panZoomInstance: any;
  let svgPanZoom: any;

  // on theme or markdown changes
  $: if (($theme || markdown) && (markdown.length > 0) && container) {
    render();
  }

  onMount(async () => {
    // Import svg-pan-zoom dynamically only on client side
    svgPanZoom = (await import('svg-pan-zoom')).default;
  });

  onDestroy(() => {
    try {
      if (panZoomInstance && typeof panZoomInstance.destroy === 'function') {
        panZoomInstance.destroy();
      }
    } catch (error) {
      console.warn('Error cleaning up pan-zoom:', error);
    }
  });

  async function render() {
    try {
      // Safely destroy existing pan-zoom instance
      try {
        if (panZoomInstance && typeof panZoomInstance.destroy === 'function') {
          panZoomInstance.destroy();
        }
      } catch (error) {
        console.warn('Error cleaning up previous pan-zoom:', error);
      }
      panZoomInstance = null;

      // Clear previous content
      while (container && container.firstChild) {
        container.removeChild(container.firstChild);
      }

      // Initialize and render mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          nodeSpacing: 50,
          rankSpacing: 50,
        },
        securityLevel: 'loose',
      });
      
      const mermaidDiv = document.createElement('div');
      mermaidDiv.className = 'mermaid';
      mermaidDiv.textContent = appendStyles(markdown) || `
graph TB
    A[Start] --> B[End]
`;

      container.appendChild(mermaidDiv);
      await mermaid.run();
      // Initialize pan-zoom after a short delay to ensure SVG is ready
      if (svgPanZoom) {
        setTimeout(() => {
          const svg = container.querySelector('svg');
          if (svg) {
            panZoomInstance = svgPanZoom(svg, {
              zoomEnabled: true,
              controlIconsEnabled: true,
              fit: true,
              center: true,
              minZoom: 0.1,
              maxZoom: 4,
              // initialZoom: 1.5,
              beforePan: function(oldPan: any, newPan: any) {
                return newPan;
              }
            });
          }
        }, 100);
      }

    } catch (error) {
      console.error('Error rendering sentence tree:', error);
      console.error('Markdown content:', currentMarkdown);
      container.innerHTML = `<div class="error">Error rendering diagram: ${error.message}</div>`;
    }
  }
</script>

<div bind:this={container}
     class="sentence-tree-container"
     style={`height: ${height}vh; width: ${width}vw;`} />

<style>
  .sentence-tree-container {
    background-color: var(--box-background);
    border-radius: 0.5rem;
    padding: 1rem;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  /* Make SVG fill the container */
  :global(.sentence-tree-container svg) {
    width: 100% !important;
    height: 100% !important;
  }

  :global(.mermaid) {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.error) {
    color: red;
    padding: 1rem;
    text-align: center;
  }
</style>
