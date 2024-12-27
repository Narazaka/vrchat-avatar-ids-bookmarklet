// @ts-check

async function main() {
  const pageSize = 100;
  const url = new URL(
    "https://vrchat.com/api/1/avatars?releaseStatus=all&sort=updated&order=descending&user=me",
  );
  url.searchParams.set("n", `${pageSize}`);
  const progressDialog = document.createElement("dialog");
  const progressText = document.createElement("p");
  progressDialog.appendChild(progressText);
  const errorText = document.createElement("p");
  errorText.style.color = "red";
  progressDialog.appendChild(errorText);
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => progressDialog.close());
  closeButton.disabled = true;
  document.body.appendChild(progressDialog);
  progressDialog.showModal();
  const avatars = [];
  let page = 0;
  while (true) {
    progressText.textContent = `Fetching page ${page + 1}`;
    url.searchParams.set("offset", `${page * pageSize}`);
    const result = await fetch(url);
    if (!result.ok) {
      errorText.textContent = `Failed to fetch page ${page + 1}`;
      closeButton.disabled = false;
      return;
    }
    const json = await result.json();
    avatars.push(...json);
    if (json.length < pageSize) {
      break;
    }
    page++;
  }
  progressDialog.close();

  const pcAvatars = avatars.filter((avatar) =>
    avatar.unityPackages.some(
      (package) =>
        package.platform === "standalonewindows" &&
        package.variant !== "impostor",
    ),
  );
  const androidAvatars = avatars.filter((avatar) =>
    avatar.unityPackages.some(
      (package) =>
        package.platform === "android" && package.variant !== "impostor",
    ),
  );

  const avatarIdsText = avatars
    .map((avatar) => `${avatar.name} ${avatar.id}`)
    .join("\n");
  const pcAvatarIdsText = pcAvatars
    .map((avatar) => `${avatar.name} ${avatar.id}`)
    .join("\n");
  const androidAvatarIdsText = androidAvatars
    .map((avatar) => `${avatar.name} ${avatar.id}`)
    .join("\n");

  const resultDialog = document.createElement("dialog");
  {
    /*
        const resultText = document.createElement("textarea");
        resultText.style.width = "60em";
        resultText.style.height = "30em";
        resultText.value = avatarIdsText;
        resultDialog.appendChild(resultText);
        */
    resultDialog.style.display = "flex";
    resultDialog.style.flexDirection = "column";
    const resultText = document.createElement("p");
    resultText.textContent = `Copy Avatar IDs`;
    resultDialog.appendChild(resultText);
    const copyButton = document.createElement("button");
    copyButton.textContent = `Copy all avatars (${avatars.length})`;
    copyButton.addEventListener("click", async () => {
      await navigator.clipboard.writeText(avatarIdsText);
    });
    resultDialog.appendChild(copyButton);
    const pcCopyButton = document.createElement("button");
    pcCopyButton.textContent = `Copy only PC avatars (${pcAvatars.length})`;
    pcCopyButton.addEventListener("click", async () => {
      await navigator.clipboard.writeText(pcAvatarIdsText);
    });
    resultDialog.appendChild(pcCopyButton);
    const androidCopyButton = document.createElement("button");
    androidCopyButton.textContent = `Copy only Android avatars (${androidAvatars.length})`;
    androidCopyButton.addEventListener("click", async () => {
      await navigator.clipboard.writeText(androidAvatarIdsText);
    });
    resultDialog.appendChild(androidCopyButton);
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => resultDialog.close());
    resultDialog.appendChild(closeButton);
  }
  document.body.appendChild(resultDialog);
  resultDialog.showModal();
}

main().catch(alert);
