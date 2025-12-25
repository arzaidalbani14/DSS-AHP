function ConsistencyDetail({ lambdaMax, ci, cr }) {
  if (cr === null) return null;

  return (
    <div style={{ marginTop: "12px" }}>
      <p>λ max : {lambdaMax.toFixed(4)}</p>
      <p>CI : {ci.toFixed(4)}</p>
      <p>CR : {cr.toFixed(4)}</p>
    </div>
  );
}

export default ConsistencyDetail;
