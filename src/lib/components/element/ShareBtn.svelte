<script lang='ts'>
  import { userEssay } from '$lib/util/store';
  import ShareIcon from '../icons/ShareIcon.svelte';

  function share() {
    if ($userEssay.length === 0) {
      alert('Enter a concept in the search bar to share');
      return;
    }
    const baseUrl: string = window.location.origin + window.location.pathname;
    const shareableUrl: string = `${baseUrl}?query=${encodeURIComponent($userEssay)}`;
    navigator.clipboard.writeText(shareableUrl)
      .then(() => {
        alert('Shareable URL copied to clipboard');
      })
      .catch((err) => {
        alert('Failed to copy shareable URL: ', err);
      });
  }
</script>

<button id="shareButton"
        class="util-btn"
        title="Share"
        on:click={share}>
  <ShareIcon class="w-6 h-6" />
</button>
