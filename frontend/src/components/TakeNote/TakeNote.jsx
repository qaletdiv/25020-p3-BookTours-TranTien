import { useState, useEffect } from "react";

const Note = [
  { id: 1, label: "Hút thuốc" },
  { id: 2, label: "Phòng tầng cao" },
  { id: 3, label: "Trẻ em hiếu động" },
  { id: 4, label: "Ăn chay" },
  { id: 5, label: "Có người khuyết tật" },
  { id: 6, label: "Phụ nữ có thai" },
];

const TakeNote = ({ setUserNote }) => {
  const [checkedMap, setCheckedMap] = useState({});
  const [tickNote, setTickNote] = useState([]);
  const [note, setNote] = useState("");

  const toggle = (note) => {
    setCheckedMap((prev) => ({
      ...prev,
      [note.id]: !prev[note.id],
    }));

    setTickNote((prev) => {
      const isChecked = checkedMap[note.id];

      if (isChecked) {
        return prev.filter((item) => item !== note.label);
      }

      return [...prev, note.label];
    });
  };

  useEffect(() => {
    setUserNote({
      have: tickNote,
      takeNote: note,
    });
  }, [tickNote, note]);

  return (
    <div>
      <p className="text-lg font-semibold mb-4">
        Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi!
      </p>

      <div className="bg-[#f6f8fa] px-5 py-6">
        {/* ===== NOTE CHECKBOX LIST ===== */}
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-[258px_325px_161px]
            gap-4 
            mb-8
          "
        >
          {Note.map((note) => (
            <div key={note.id}>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkedMap[note.id] || false}
                  onChange={() => toggle(note)}
                  className="hidden"
                />

                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border
                    ${
                      checkedMap[note.id]
                        ? "bg-[#013879] border-[#013879] text-white"
                        : "border-gray-800 text-transparent"
                    }
                  `}
                >
                  ✓
                </span>

                <span
                  className={
                    checkedMap[note.id]
                      ? "text-[#013879] font-semibold"
                      : "text-gray-800"
                  }
                >
                  {note.label}
                </span>
              </label>
            </div>
          ))}
        </div>

        {/* ===== TEXTAREA NOTE ===== */}
        <textarea
          className="
            w-full 
            min-h-[120px] 
            border
            px-4 py-3 
            text-sm 
            text-gray-800
            placeholder-gray-400
            focus:outline-none
            resize-none
          "
          placeholder="Nhập ghi chú của bạn..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default TakeNote;
