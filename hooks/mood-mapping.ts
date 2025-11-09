export const moodMapping: Record<string, string> = {
  happy: "HAPPY",
  calm: "CALM",
  anxious: "ANXIOUS",
  sad: "SAD",
  excited: "EXCITED",
  stressed: "STRESSED",
  peaceful: "PEACEFUL",
  grateful: "GRATEFUL",
};

export const moodReverseMapping: Record<string, string> = {
  HAPPY: "happy",
  CALM: "calm",
  ANXIOUS: "anxious",
  SAD: "sad",
  EXCITED: "excited",
  STRESSED: "stressed",
  PEACEFUL: "peaceful",
  GRATEFUL: "grateful",
};


export const moodConfig: { [key: string]: { icon: string; color: string } } = {
  happy: { icon: "😊", color: "#FFD93D" },
  calm: { icon: "😌", color: "#A8E6CF" },
  anxious: { icon: "😰", color: "#FF8B94" },
  sad: { icon: "😢", color: "#6C88C4" },
  excited: { icon: "🤗", color: "#FFB347" },
  stressed: { icon: "😫", color: "#C44569" },
  peaceful: { icon: "☮️", color: "#95E1D3" },
  grateful: { icon: "🙏", color: "#F38181" },
};
