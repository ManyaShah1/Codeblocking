// src/TutorialsPage.js
import React from 'react';
// import { useNavigate } from 'react-router-dom'; // <-- No longer needed
import { useBlockly } from './BlocklyContext'; // <-- 1. IMPORT THE HOOK
import ShapesBackground from './ShapesBackground'; // <-- 1. IMPORT SHAPES
import './TutorialsPage.css'; 
import './LandingPage.css'; //

// --- XML Samples (Corrected) ---
const codeSamplesXml = {
  // FIXED: Variable ID for 'num1' (0H{El2ID8!)]$=*Vh3F) now matches in all blocks.
  swapping_of_numbers: `<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="0H{El2ID8!)]$=*Vh3F">num1</variable><variable id="ghX(36DI~T*d-y!Z2O1Z">num2</variable><variable id="pbGm3!~:2d^-D5w@c/vg">temp</variable></variables><block type="variables_set" id=";$jZOG^Cg\`_TOg$gT5b@" x="168" y="58"><field name="VAR" id="0H{El2ID8!)]$=*Vh3F">num1</field><value name="VALUE"><block type="math_number" id="qEOZ0~9/nQLEEMl{|j.g"><field name="NUM">10</field></block></value><next><block type="variables_set" id="==(LrB7Vtcnu{x#-Wkr{"><field name="VAR" id="ghX(36DI~T*d-y!Z2O1Z">num2</field><value name="VALUE"><block type="math_number" id="VLI^jyfkrhYhgeG_y!%v"><field name="NUM">20</field></block></value><next><block type="variables_set" id="LhQt_@51y9|)iUje@^c"><field name="VAR" id="pbGm3!~:2d^-D5w@c/vg">temp</field><value name="VALUE"><block type="variables_get" id="(/tNTsg.=MMVQLJ2T:+"><field name="VAR" id="0H{El2ID8!)]$=*Vh3F">num1</field></block></value><next><block type="variables_set" id="o,-)Y*BzVM9iMhCcgi2d"><field name="VAR" id="0H{El2ID8!)]$=*Vh3F">num1</field><value name="VALUE"><block type="variables_get" id="W32752e=?\`sEbpZ~|aNJ"><field name="VAR" id="ghX(36DI~T*d-y!Z2O1Z">num2</field></block></value><next><block type="variables_set" id="7=/gf5sJHEW$7vXcA+QO"><field name="VAR" id="ghX(36DI~T*d-y!Z2O1Z">num2</field><value name="VALUE"><block type="variables_get" id="e0Gnn%C(]-LhtGJWz=:J"><field name="VAR" id="pbGm3!~:2d^-D5w@c/vg">temp</field></block></value><next><block type="text_print" id="Qk^?Ql+QU#+qbS@dDQF;"><value name="TEXT"><block type="variables_get" id="hbdP-I+_*9+vmi]vU_x"><field name="VAR" id="0H{El2ID8!)]$=*Vh3F">num1</field></block></value><next><block type="text_print" id="MbYjTmNk00Gy9I/X@yiZ"><value name="TEXT"><block type="variables_get" id="j%!u4}iFry2j2TNuywLA"><field name="VAR" id="ghX(36DI~T*d-y!Z2O1Z">num2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>`,
  
  biggestnumber: `<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="0H{El2ID8!)]$=*Vh3F">num1</variable><variable id="ghX(36DI~T*d-y!Z2O1Z">num2</variable></variables><block type="variables_set" id="}9}WTV{Yh_f\`f4y:o)oi" x="242" y="20"><field name="VAR" id="0H{El2ID8!)]$=*Vh3F">num1</field><value name="VALUE"><block type="math_number" id="C#)hBELcYaY,=Ym*X@;S"><field name="NUM">15</field></block></value><next><block type="variables_set" id="%Y8#:f6h.gPqfoUWDD;)"><field name="VAR" id="ghX(36DI~T*d-y!Z2O1Z">num2</field><value name="VALUE"><block type="math_number" id="lbuOR+(nVw9D)JLMb2nA"><field name="NUM">10</field></block></value><next><block type="controls_if" id="z;f:Vy]^IQ!LsuXY:Vzu"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="w%c|Y+(]*3PB:Le0#Z/G"><field name="OP">GT</field><value name="A"><block type="variables_get" id="p\`4?yfbWvY;9bv/;$w"><field name="VAR" id="0H{El2ID8!)]$=*Vh3F">num1</field></block></value><value name="B"><block type="variables_get" id="I:.JnmD/mGNtKf2~3_jK"><field name="VAR" id="ghX(36DI~T*d-y!Z2O1Z">num2</field></block></value></block></value><statement name="DO0"><block type="text_print" id="zSM\`@}?4,VxFRbkV1t^g"><value name="TEXT"><block type="variables_get" id="xO?4R]eLELGEwv3!r;H"><field name="VAR" id="0H{El2ID8!)]$=*Vh3F">num1</field></block></value></block></statement><statement name="ELSE"><block type="text_print" id="FljM]Y6_g/wc8-k+Affj"><value name="TEXT"><block type="variables_get" id="~H?zmk,cE$VOY6*%e.\`z"><field name="VAR" id="ghX(36DI~T*d-y!Z2O1Z">num2</field></block></value></block></statement></block></next></block></next></block></xml>`,
  
  even_or_odd: `<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="0H{El2ID8!)]$=*Vh3F">num1</variable></variables><block type="variables_set" id="E$MO)#c]!tn$.zBFpa?d" x="350" y="110"><field name="VAR" id="0H{El2ID8!)]$=*Vh3F">num1</field><value name="VALUE"><block type="math_number" id="(WaRlxhW[DCj;d_c/#*o"><field name="NUM">15</field></block></value><next><block type="controls_if" id="{zlu,DsWv^L~:E3HC/Ly"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="-kd=9NB9]Xr}x/HS9V}t"><field name="OP">EQ</field><value name="A"><block type="math_modulo" id="?fos@/A|eMTKk5Al_(~u"><value name="DIVIDEND"><block type="variables_get" id="=E5pg}DKtN6M8-vu\`=:;"><field name="VAR" id="0H{El2ID8!)]$=*Vh3F">num1</field></block></value><value name="DIVISOR"><block type="math_number" id="~NH?9VOsR+lHV|]H-jf\`"><field name="NUM">2</field></block></value></block></value><value name="B"><block type="math_number" id="]QFo^RaG-USNH?:VFYE"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="text_print" id="rqIzTzr*NNV)$S3%%}Hc"><value name="TEXT"><block type="text" id="zypY6c\`x!Xrc%mCy;gMO"><field name="TEXT">Even</field></block></value></block></statement><statement name="ELSE"><block type="text_print" id="e}Hxu)=;xzaOq;muEdOJ"><value name="TEXT"><block type="text" id="fdY8D[pZq4]l7Z@U|W9-"><field name="TEXT">Odd</field></block></value></block></statement></block></next></block></xml>`,
  
  connect_two_strings: `<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="%%v^K:)!O!#VRVPDJF@l">greeting</variable><variable id="5=6vX-2(kg8?Upi:}X+$">name</variable><variable id="aJUgs^Q9qZ)t!A(/@w{y">message</variable></variables><block type="variables_set" id=";$jZOG^Cg\`_TOg$gT5b@" x="168" y="58"><field name="VAR" id="%%v^K:)!O!#VRVPDJF@l">greeting</field><value name="VALUE"><block type="text" id="Gq/vhhwcZ(N=StQu$Ieb"><field name="TEXT">hello</field></block></value><next><block type="variables_set" id="==(LrB7Vtcnu{x#-Wkr{"><field name="VAR" id="5=6vX-2(kg8?Upi:}X+$">name</field><value name="VALUE"><block type="text" id="G3Wb^|jK;K!0\`Hgq^EYI"><field name="TEXT">world</field></block></value><next><block type="variables_set" id="LhQt__@51y9|)iUje@^c"><field name="VAR" id="aJUgs^Q9qZ)t!A(/@w{y">message</field><value name="VALUE"><block type="text_join" id="EZG1MQ{QR7IV.1$wN7("><mutation items="3"></mutation><value name="ADD0"><block type="variables_get" id=")9v#}|qN9IB$NPt[i[W"><field name="VAR" id="%%v^K:)!O!#VRVPDJF@l">greeting</field></block></value><value name="ADD1"><block type="text" id="space_text"><field name="TEXT"> </field></block></value><value name="ADD2"><block type="variables_get" id="sHfo7?%KLsj\`1fa2oh=f"><field name="VAR" id="5=6vX-2(kg8?Upi:}X+$">name</field></block></value></block></value><next><block type="text_print" id="Qk^?Ql+QU#+qbS@dDQF;"><value name="TEXT"><block type="variables_get" id="_(/tNTsg.=MMVQLJ2T:+"><field name="VAR" id="aJUgs^Q9qZ)t!A(/@w{y">message</field></block></value></block></next></block></next></block></next></block></xml>`,
  
  // FIXED: Variable ID for 'a' (t+N3bk)|n[w?H,xE4r) now matches (removed extra '~' prefix).
  simple_calculator: `<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="t+N3bk)|n[w?H,xE4r">a</variable><variable id=".uX;Bpo*E:R0v}-XDzeu">b</variable><variable id="!YL#L.3LJ8hvs@T;.Vjl">result</variable></variables><block type="variables_set" id="RQPox%@Zp]CcKe-[eB]C" x="203" y="19"><field name="VAR" id="t+N3bk)|n[w?H,xE4r">a</field><value name="VALUE"><block type="math_number" id="KQ!Gf%Z@lp578]6csw_6"><field name="NUM">20</field></block></value><next><block type="variables_set" id=",z/!:o_3Je$]fAi~t$m"><field name="VAR" id=".uX;Bpo*E:R0v}-XDzeu">b</field><value name="VALUE"><block type="math_number" id="L~^mytUJmkeLcGrd;:z"><field name="NUM">10</field></block></value><next><block type="variables_set" id="{lUhf3g^P65Qj=(##sDG"><field name="VAR" id="!YL#L.3LJ8hvs@T;.Vjl">result</field><value name="VALUE"><block type="math_arithmetic" id="-48q[iw;cK-Qe:v;trZ-"><field name="OP">ADD</field><value name="A"><block type="variables_get" id="rd7+mNuhg6]J@5y$X.rh"><field name="VAR" id="t+N3bk)|n[w?H,xE4r">a</field></block></value><value name="B"><block type="variables_get" id="K83A{jp.uY%D\`UhFn}"><field name="VAR" id=".uX;Bpo*E:R0v}-XDzeu">b</field></block></value></block></value><next><block type="text_print" id="lTj@,f)mX;=W_)77zf7j"><value name="TEXT"><block type="variables_get" id=":5(6@x~_+-4b?L!YpQl"><field name="VAR" id="!YL#L.3LJ8hvs@T;.Vjl">result</field></block></value></block></next></block></next></block></next></block></xml>`
};

// --- YouTube Video Links ---
const videoLinks = {
  codinginblockly: "https://www.youtube.com/embed/XpfN_rN9gZM?si=tTKJUHtROT9DKJ1A",
  Basicscalculator: "https://www.youtube.com/embed/Qw0_e3-LdJc?si=fMZlcdt9c8CV4u2_",
  blocklyforkids: "https://www.youtube.com/embed/mWjHgX2SPbU?si=gyTPtSQUAVaMbk4E"
};


function TutorialsPage() {
  // 2. USE THE HOOK
  const { loadSampleAndNavigate } = useBlockly();

  const loadSampleIntoWorkspace = (sampleXml) => {
    // 3. CALL THE CONTEXT FUNCTION
    loadSampleAndNavigate(sampleXml);
  };

  return (
    <div className="tutorials-container page-container"> 
      <h1>Tutorials & Code Samples</h1>

      {/* --- 5. VIDEO TUTORIALS SECTION MOVED FIRST --- */}
      <section className="tutorial-section">
        <h2>Video Tutorials</h2>
        <p>Watch these videos to learn more about Python and visual programming.</p>
        <div className="video-grid">
          {Object.entries(videoLinks).map(([key, src]) => (
            <div className="video-wrapper" key={key}>
              <iframe
                src={src}
                title={`YouTube video player - ${key}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen>
              </iframe>
            </div>
          ))}
        </div>
      </section>

      {/* --- 5. CODE SAMPLES SECTION MOVED SECOND --- */}
      <section className="tutorial-section">
        <h2>Load Code Samples</h2>
        <p>Click a button to load a pre-made code sample into the Blockly workspace.</p>
        <ul className="sample-list">
          {Object.entries(codeSamplesXml).map(([key, xml]) => (
            // The onClick is now on the button
            <li key={key}> 
              <span>{key.replace(/_/g, ' ').replace(/^./, str => str.toUpperCase())}</span>
              <button 
                className="btn-load-sample" 
                onClick={() => loadSampleIntoWorkspace(xml)}
              >
                Load Sample
              </button>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}

export default TutorialsPage;