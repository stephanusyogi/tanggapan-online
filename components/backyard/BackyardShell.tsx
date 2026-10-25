"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { AdminUser } from "@/lib/auth";

interface BackyardShellProps {
  admin: AdminUser;
  children: React.ReactNode;
}

export default function BackyardShell({ admin, children }: BackyardShellProps) {
  const [sidebarToggled, setSidebarToggled] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarToggled(!sidebarToggled);
  };

  return (
    <div id="page-top" className={sidebarToggled ? "sidebar-toggled" : ""}>
      {/* External CSS for RuangAdmin */}
      <link
        rel="stylesheet"
        href="/template/vendor/fontawesome-free/css/all.min.css"
      />
      <link
        rel="stylesheet"
        href="/template/vendor/bootstrap/css/bootstrap.min.css"
      />
      <link rel="stylesheet" href="/template/css/ruang-admin.css" />

      <div id="wrapper" style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <ul
          className={`navbar-nav sidebar sidebar-light accordion ${
            sidebarToggled ? "toggled" : ""
          }`}
          id="accordionSidebar"
          style={{
            backgroundColor: "#fff",
            boxShadow: "0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)",
          }}
        >
          <Link
            className="sidebar-brand d-flex align-items-center justify-content-center"
            href="/backyard"
            style={{
              backgroundColor: "#550d07",
              color: "#fff",
              padding: "1.5rem 1rem",
              textDecoration: "none",
            }}
          >
            <div className="sidebar-brand-icon">
              <Image
                src="/images/logo-kpu-ngawi.png"
                alt="Logo KPU Ngawi"
                width={36}
                height={36}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="sidebar-brand-text mx-3 font-weight-bold" style={{ fontSize: "0.95rem" }}>
              Tanggapan Masyarakat
            </div>
          </Link>

          <hr className="sidebar-divider my-0" />

          {/* Nav Item - Dashboard */}
          <li className={`nav-item ${pathname === "/backyard" ? "active" : ""}`}>
            <Link className="nav-link" href="/backyard">
              <i className="fas fa-fw fa-tachometer-alt mr-2 text-danger"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          <hr className="sidebar-divider" />
          <div className="sidebar-heading text-muted px-3 py-1 font-weight-bold" style={{ fontSize: "0.75rem" }}>
            TANGGAPAN
          </div>

          {/* Unified Tanggapan Menu */}
          <li
            className={`nav-item ${
              pathname.startsWith("/backyard/tanggapan") ? "active" : ""
            }`}
          >
            <Link className="nav-link" href="/backyard/tanggapan">
              <i className="fas fa-fw fa-comments mr-2 text-primary"></i>
              <span>Tanggapan Masyarakat</span>
            </Link>
          </li>

          <hr className="sidebar-divider" />
          <div className="sidebar-heading text-muted px-3 py-1 font-weight-bold" style={{ fontSize: "0.75rem" }}>
            MANAJEMEN
          </div>

          {/* Nav Item - Administrator */}
          <li
            className={`nav-item ${
              pathname.startsWith("/backyard/administrator") ? "active" : ""
            }`}
          >
            <Link className="nav-link" href="/backyard/administrator">
              <i className="fas fa-fw fa-users-cog mr-2 text-info"></i>
              <span>Administrator</span>
            </Link>
          </li>

          {/* Nav Item - Ke Web Publik */}
          <li className="nav-item">
            <Link className="nav-link" href="/" target="_blank">
              <i className="fas fa-fw fa-globe mr-2 text-success"></i>
              <span>Lihat Web Publik</span>
            </Link>
          </li>

          <hr className="sidebar-divider" />
          <div className="version text-center py-3 text-muted small" id="version-ruangadmin">
            Tangmas v2.0 &bull; KPU Ngawi
          </div>
        </ul>

        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column flex-grow-1" style={{ backgroundColor: "#f8f9fc" }}>
          <div id="content">
            {/* TopBar Navbar */}
            <nav
              className="navbar navbar-expand navbar-light topbar mb-4 static-top shadow"
              style={{ backgroundColor: "#550d07" }}
            >
              <button
                id="sidebarToggleTop"
                className="btn btn-link rounded-circle mr-3 text-white"
                onClick={toggleSidebar}
                type="button"
                aria-label="Toggle Sidebar"
              >
                <i className="fa fa-bars"></i>
              </button>

              {/* Topbar Navbar User */}
              <ul className="navbar-nav ml-auto align-items-center">
                <div className="topbar-divider d-none d-sm-block"></div>

                <li className="nav-item dropdown no-arrow position-relative">
                  <button
                    className="nav-link dropdown-toggle btn btn-link text-white d-flex align-items-center"
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{ textDecoration: "none", outline: "none" }}
                  >
                    <i className="fas fa-user-circle fa-2x mr-2 text-white"></i>
                    <span className="d-none d-lg-inline text-white small font-weight-bold">
                      {admin.name}
                    </span>
                    <i className="fas fa-chevron-down ml-2 small text-white-50"></i>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="dropdown-menu dropdown-menu-right shadow animated--grow-in show"
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        zIndex: 1000,
                        minWidth: "14rem",
                      }}
                    >
                      <div className="dropdown-header text-muted font-weight-bold px-3 py-2 small">
                        Signed in as
                        <div className="text-dark font-weight-bold text-truncate">{admin.email}</div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link
                        className="dropdown-item px-3 py-2 text-dark"
                        href="/backyard/administrator"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <i className="fas fa-user-shield fa-sm fa-fw mr-2 text-gray-400"></i>
                        Manajemen Admin
                      </Link>
                      <div className="dropdown-divider"></div>
                      <a
                        className="dropdown-item px-3 py-2 text-danger font-weight-bold"
                        href="/logout"
                      >
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-danger"></i>
                        Logout
                      </a>
                    </div>
                  )}
                </li>
              </ul>
            </nav>

            {/* Main Page Content */}
            <div className="container-fluid">{children}</div>
          </div>

          {/* Footer */}
          <footer className="sticky-footer bg-white mt-auto py-3 shadow-sm">
            <div className="container my-auto">
              <div className="copyright text-center my-auto text-muted small">
                <span>
                  Copyright &copy; {new Date().getFullYear()} - <strong>KPU Kabupaten Ngawi</strong>. All Rights Reserved.
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
