; Default install dir: Program Files (x86)\RES POS on 64-bit Windows; falls back to ProgramFiles on 32-bit.
; Must stay in sync with package.json build.productName ("RES POS").

!macro preInit
  SetRegView 64
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion" "ProgramFilesDir (x86)"
  StrCmp $0 "" 0 +2
    ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion" "ProgramFilesDir"
  StrCmp $0 "" +2
    StrCpy $INSTDIR "$0\RES POS"
!macroend
