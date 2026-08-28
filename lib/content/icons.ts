import {
  mdiAndroid,
  mdiBug,
  mdiCogs,
  mdiDatabase,
  mdiDocker,
  mdiFirebase,
  mdiGit,
  mdiLanguageJavascript,
  mdiLanguageTypescript,
  mdiMicrosoftAzure,
  mdiNodejs,
  mdiReact,
  mdiRocket,
  mdiSourcePull,
  mdiTestTube,
} from "@mdi/js";

const ICON_MAP: Record<string, string> = {
  javascript: mdiLanguageJavascript,
  typescript: mdiLanguageTypescript,
  react: mdiReact,
  nodejs: mdiNodejs,
  mongodb: mdiDatabase,
  docker: mdiDocker,
  git: mdiGit,
  firebase: mdiFirebase,
  android: mdiAndroid,
  azure: mdiMicrosoftAzure,
  jest: mdiTestTube,
  cypress: mdiTestTube,
  detox: mdiBug,
  "github-actions": mdiSourcePull,
  "ci-cd": mdiCogs,
  fastlane: mdiRocket,
};

export function resolveSkillIcon(iconKey: string): string {
  return ICON_MAP[iconKey] ?? mdiReact;
}
