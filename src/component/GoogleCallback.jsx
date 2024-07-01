import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleGoogleCallback(navigate));
  }, [dispatch, navigate]);

  return (
    <div>Loading...</div>
  );
};

export default GoogleCallback;
