import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ThemeLangHeader from "./components/ThemeLangHeader";
import MobileSlideBar from "./components/MobileSlideBar";
import BottomNav from "./components/BottomNav";

import Home from "./pages/Home";
import Control from "./pages/Control";
import Farm from "./pages/Farm";
import Reports from "./pages/Reports";
import FarmMapPage from "./pages/FarmMapPage";
import AIAdvisorPage from "./pages/AIAdvisorPage";
import GatewayPage from "./pages/GatewayPage";

import { mockFarmData, mockTodayReport, mockWeeklyReport } from "./data/mockData";
import {
  getDashboardState,
  turnPumpOn,
  turnPumpOff,
  togglePumpRelay,
  createIrrigationSchedule,
  updateIrrigationSchedule,
  setSmartIrrigation,
  setCrop,
} from "./services/api";

import "./index.css";

export default function App() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("home");
  const [farmData, setFarmData] = useState(mockFarmData);
  const [pumpLoading, setPumpLoading] = useState(false);
  const [commandStatus, setCommandStatus] = useState("");
  const [slideBarOpen, setSlideBarOpen] = useState(false);
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);

  // Sync data from backend
  const fetchBackendData = useCallback(async () => {
    try {
      setIsLiveSyncing(true);
      const data = await getDashboardState();
      if (data && data.farm) {
        setFarmData(data);
      }
    } catch (err) {
      console.warn("Backend sync error:", err);
    } finally {
      setIsLiveSyncing(false);
    }
  }, []);

  // Initial fetch and real-time polling every 3.5 seconds
  useEffect(() => {
    fetchBackendData();
    const interval = setInterval(fetchBackendData, 3500);
    return () => clearInterval(interval);
  }, [fetchBackendData]);

  useEffect(() => {
    document.title = t("app_title") || "CropIQ - Precision Smart Agriculture";
  }, [t]);

  const showStatus = (msg, duration = 3000) => {
    setCommandStatus(msg);
    setTimeout(() => setCommandStatus(""), duration);
  };

  const handlePumpToggle = useCallback(async () => {
    const pumpOn = farmData.pump?.isOn;
    setPumpLoading(true);
    showStatus(t("sending_command") || "Transmitting relay command to Pi Gateway...", 5000);

    try {
      if (pumpOn) {
        await turnPumpOff();
      } else {
        await turnPumpOn();
      }
      await fetchBackendData();
      showStatus(pumpOn ? t("pump_off") || "Pump Stopped" : t("pump_running") || "Pump Running");
    } catch (err) {
      showStatus("Relay transmission failed. Please try again.");
    } finally {
      setPumpLoading(false);
    }
  }, [farmData.pump?.isOn, fetchBackendData, t]);

  const handleScheduleAdd = useCallback(async (schedule) => {
    const result = await createIrrigationSchedule(schedule);
    const newSched = { ...schedule, id: result.id || Date.now().toString(), repeatLabel: schedule.repeat };
    setFarmData((prev) => ({
      ...prev,
      irrigation: {
        ...prev.irrigation,
        schedules: [...(prev.irrigation?.schedules || []), newSched],
      },
    }));
  }, []);

  const handleScheduleUpdate = useCallback(async (id, schedule) => {
    await updateIrrigationSchedule(id, schedule);
    setFarmData((prev) => ({
      ...prev,
      irrigation: {
        ...prev.irrigation,
        schedules: (prev.irrigation?.schedules || []).map((s) =>
          s.id === id ? { ...s, ...schedule } : s
        ),
      },
    }));
  }, []);

  const handleScheduleDelete = useCallback((id) => {
    setFarmData((prev) => ({
      ...prev,
      irrigation: {
        ...prev.irrigation,
        schedules: (prev.irrigation?.schedules || []).filter((s) => s.id !== id),
      },
    }));
  }, []);

  const handleSmartIrrigationToggle = useCallback(async (enabled) => {
    await setSmartIrrigation(enabled);
    setFarmData((prev) => ({
      ...prev,
      irrigation: { ...prev.irrigation, smartIrrigationEnabled: enabled },
    }));
  }, []);

  const handleCropChange = useCallback(async (cropType) => {
    await setCrop(cropType);
    await fetchBackendData();
  }, [fetchBackendData]);

  const reportData = { today: mockTodayReport, weekly: mockWeeklyReport };

  const pages = {
    home: (
      <Home
        data={farmData}
        onPumpToggle={handlePumpToggle}
        pumpLoading={pumpLoading}
        onNavChange={setTab}
        onRefresh={fetchBackendData}
      />
    ),
    map: (
      <FarmMapPage
        data={farmData}
        onPumpToggle={handlePumpToggle}
        onRefresh={fetchBackendData}
      />
    ),
    ai: (
      <AIAdvisorPage
        data={farmData}
        onPumpToggle={handlePumpToggle}
      />
    ),
    control: (
      <Control
        data={farmData}
        onPumpToggle={handlePumpToggle}
        pumpLoading={pumpLoading}
        commandStatus={commandStatus}
        onScheduleAdd={handleScheduleAdd}
        onScheduleUpdate={handleScheduleUpdate}
        onScheduleDelete={handleScheduleDelete}
        onSmartIrrigationToggle={handleSmartIrrigationToggle}
      />
    ),
    farm: <Farm data={farmData} onCropChange={handleCropChange} />,
    gateway: (
      <GatewayPage
        data={farmData}
        onRefresh={fetchBackendData}
      />
    ),
    reports: <Reports data={reportData} />,
  };

  return (
    <div className="app-shell mobile-app-shell">
      {/* Top Mobile Header */}
      <ThemeLangHeader
        onOpenSlideBar={() => setSlideBarOpen(true)}
        gateway={farmData.gateway}
      />

      {/* Slide-out Mobile Sidebar Drawer */}
      <MobileSlideBar
        isOpen={slideBarOpen}
        onClose={() => setSlideBarOpen(false)}
        activeTab={tab}
        onNavChange={setTab}
        gateway={farmData.gateway}
        nodes={farmData.nodes}
        onDataRefresh={fetchBackendData}
      />

      {/* Command Feedback Toast */}
      {commandStatus && (
        <div className="app-command-toast">
          <span>{commandStatus}</span>
        </div>
      )}

      {/* Main Screen Content */}
      <main className="app-main mobile-main-scroll" id="main-content">
        {pages[tab] || pages.home}
      </main>

      {/* Bottom Mobile Header / Bottom Navigation */}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
