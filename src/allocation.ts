export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let assignedCrew = 2;

type DisplayRow = {
  label: string;
  color: string;
  value: number;
};

type ShiftResults = {
  assignedCrew: number;
  production: number;
  consumption: number;
  balance: number;
};

function calculateShift(crewOnSupplies: number): ShiftResults {
  const production = crewOnSupplies * 3;
  const consumption = 6;
  const balance = production - consumption;

  return { assignedCrew: crewOnSupplies, production, consumption, balance };
}

function renderAllocation() {
  const shift = calculateShift(assignedCrew);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < shift.assignedCrew ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < shift.assignedCrew ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${shift.assignedCrew} / 6`, 18, 76);

  const rows: DisplayRow[] = [
    {
      label: "Production",
      color: "#27766b",
      value: shift.production,
    },
    {
      label: "Consumption",
      color: "#a44d23",
      value: shift.consumption,
    },
  ];

  for (const [index, row] of rows.entries()) {
    const labelY = 102 + index * 52;
    const barY = 110 + index * 52;

    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.label}: ${row.value}`, 18, labelY);

    ctx.fillStyle = row.color;
    ctx.fillRect(18, barY, row.value * 14, 20);
  }

  readout.textContent =
    `Assigned: ${shift.assignedCrew}/6 · Production: ${shift.production} · Consumption: ${shift.consumption} · Balance: ${
      shift.balance > 0 ? "+" : ""
    }${shift.balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedCrew = Math.max(0, assignedCrew - 1);
  renderAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedCrew = Math.min(6, assignedCrew + 1);
  renderAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedCrew = 2;
    renderAllocation();
  };
renderAllocation();
