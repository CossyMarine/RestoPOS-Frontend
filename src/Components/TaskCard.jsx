export default function TaskCard({ title, description }) {
  return (
    <div className="p-4 border rounded-lg shadow mb-3">
      <h2 className="font-bold">{title}</h2>
      <p>{description}</p>
    </div>
  );
}