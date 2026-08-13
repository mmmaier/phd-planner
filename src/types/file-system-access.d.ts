// Minimal ambient types for the File System Access API — not yet part of
// TypeScript's built-in DOM lib, and only implemented in Chromium browsers.
// Firefox/Safari fall back to the classic <a download> flow at the call
// site, so these types only need to cover what we actually use.

interface FileSystemPermissionDescriptor {
  mode?: "read" | "readwrite";
}

interface FileSystemWritableFileStream {
  write(data: BlobPart): Promise<void>;
  close(): Promise<void>;
}

interface FileSystemFileHandle {
  readonly name: string;
  queryPermission(descriptor?: FileSystemPermissionDescriptor): Promise<PermissionState>;
  requestPermission(descriptor?: FileSystemPermissionDescriptor): Promise<PermissionState>;
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: { description: string; accept: Record<string, string[]> }[];
  startIn?: FileSystemFileHandle | WellKnownDirectory;
}

type WellKnownDirectory = "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos";

interface Window {
  showSaveFilePicker?(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
}
