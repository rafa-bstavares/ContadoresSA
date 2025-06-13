import { FastifyRequest, FastifyReply } from "fastify"
import { parseStringPromise, processors } from 'xml2js';

export function xmlExampleFunction(request: FastifyRequest, reply: FastifyReply){

    
    
    const xmlString = `
    <nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
    <NFe xmlns="http://www.portalfiscal.inf.br/nfe">
    <infNFe Id="NFe41250102677857000257550010000894851117232170" versao="4.00">
    <ide>
    <cUF>41</cUF>
    <cNF>11723217</cNF>
    <natOp>VENDA DE MERC. ADQUIRIDA OU RECEBIDA DE TERCEIROS</natOp>
    <mod>55</mod>
    <serie>1</serie>
    <nNF>89485</nNF>
    <dhEmi>2025-01-17T10:05:00-03:00</dhEmi>
    <dhSaiEnt>2025-01-17T10:05:00-03:00</dhSaiEnt>
    <tpNF>1</tpNF>
    <idDest>1</idDest>
    <cMunFG>4106902</cMunFG>
    <tpImp>1</tpImp>
    <tpEmis>1</tpEmis>
    <cDV>0</cDV>
    <tpAmb>1</tpAmb>
    <finNFe>1</finNFe>
    <indFinal>0</indFinal>
    <indPres>3</indPres>
    <indIntermed>0</indIntermed>
    <procEmi>0</procEmi>
    <verProc>2.1.008.019</verProc>
    </ide>
    <emit>
    <CNPJ>02677857000257</CNPJ>
    <xNome>COMERCIAL LANCARE LTDA</xNome>
    <xFant>LANCARE</xFant>
    <enderEmit>
    <xLgr>RUA MARTHA GEMBAROSKI TULESKI</xLgr>
    <nro>276</nro>
    <xBairro>CIC</xBairro>
    <cMun>4106902</cMun>
    <xMun>CURITIBA</xMun>
    <UF>PR</UF>
    <CEP>81460280</CEP>
    <cPais>1058</cPais>
    <xPais>BRASIL</xPais>
    <fone>4130201040</fone>
    </enderEmit>
    <IE>9069568880</IE>
    <CRT>3</CRT>
    </emit>
    <dest>
    <CNPJ>85492668000156</CNPJ>
    <xNome>CD REVESTIMENTOS LTDA</xNome>
    <enderDest>
    <xLgr>R JOAO BETTEGA,829</xLgr>
    <nro>829</nro>
    <xBairro>PORTAO</xBairro>
    <cMun>4106902</cMun>
    <xMun>CURITIBA</xMun>
    <UF>PR</UF>
    <CEP>81070000</CEP>
    <cPais>1058</cPais>
    <xPais>BRASIL</xPais>
    <fone>32292411</fone>
    </enderDest>
    <indIEDest>1</indIEDest>
    <IE>1019211408</IE>
    <email>carlos@casanovaalldecor.com.br</email>
    </dest>
    <det nItem="1">
    <prod>
    <cProd>1205</cProd>
    <cEAN>SEM GTIN</cEAN>
    <xProd>ADESIVO STIXA180 VINYL 23KG - FORTALEZA</xProd>
    <NCM>35069900</NCM>
    <CEST>2804300</CEST>
    <indEscala>S</indEscala>
    <CFOP>5102</CFOP>
    <uCom>UN</uCom>
    <qCom>5.0000</qCom>
    <vUnCom>431.7100000000</vUnCom>
    <vProd>2158.55</vProd>
    <cEANTrib>SEM GTIN</cEANTrib>
    <uTrib>UN</uTrib>
    <qTrib>5.0000</qTrib>
    <vUnTrib>431.7100000000</vUnTrib>
    <indTot>1</indTot>
    <xPed>40001338</xPed>
    <nItemPed>1</nItemPed>
    </prod>
    <imposto>
    <ICMS>
    <ICMS00>
    <orig>0</orig>
    <CST>00</CST>
    <modBC>3</modBC>
    <vBC>2158.55</vBC>
    <pICMS>19.5000</pICMS>
    <vICMS>420.92</vICMS>
    </ICMS00>
    </ICMS>
    <IPI>
    <cEnq>999</cEnq>
    <IPITrib>
    <CST>99</CST>
    <vBC>0.00</vBC>
    <pIPI>0.0000</pIPI>
    <vIPI>0.00</vIPI>
    </IPITrib>
    </IPI>
    <PIS>
    <PISAliq>
    <CST>01</CST>
    <vBC>2158.55</vBC>
    <pPIS>1.6500</pPIS>
    <vPIS>35.62</vPIS>
    </PISAliq>
    </PIS>
    <COFINS>
    <COFINSAliq>
    <CST>01</CST>
    <vBC>2158.55</vBC>
    <pCOFINS>7.6000</pCOFINS>
    <vCOFINS>164.05</vCOFINS>
    </COFINSAliq>
    </COFINS>
    </imposto>
    </det>
    <det nItem="2">
    <prod>
    <cProd>1199</cProd>
    <cEAN>SEM GTIN</cEAN>
    <xProd>ADESIVO STIXA180 VINYL 4KG - FORTALEZA</xProd>
    <NCM>35069900</NCM>
    <CEST>2804300</CEST>
    <indEscala>S</indEscala>
    <CFOP>5102</CFOP>
    <uCom>UN</uCom>
    <qCom>10.0000</qCom>
    <vUnCom>87.1800000000</vUnCom>
    <vProd>871.80</vProd>
    <cEANTrib>SEM GTIN</cEANTrib>
    <uTrib>UN</uTrib>
    <qTrib>10.0000</qTrib>
    <vUnTrib>87.1800000000</vUnTrib>
    <indTot>1</indTot>
    <xPed>40001338</xPed>
    <nItemPed>2</nItemPed>
    </prod>
    <imposto>
    <ICMS>
    <ICMS00>
    <orig>0</orig>
    <CST>00</CST>
    <modBC>3</modBC>
    <vBC>871.80</vBC>
    <pICMS>19.5000</pICMS>
    <vICMS>170.00</vICMS>
    </ICMS00>
    </ICMS>
    <IPI>
    <cEnq>999</cEnq>
    <IPITrib>
    <CST>99</CST>
    <vBC>0.00</vBC>
    <pIPI>0.0000</pIPI>
    <vIPI>0.00</vIPI>
    </IPITrib>
    </IPI>
    <PIS>
    <PISAliq>
    <CST>01</CST>
    <vBC>871.80</vBC>
    <pPIS>1.6500</pPIS>
    <vPIS>14.38</vPIS>
    </PISAliq>
    </PIS>
    <COFINS>
    <COFINSAliq>
    <CST>01</CST>
    <vBC>871.80</vBC>
    <pCOFINS>7.6000</pCOFINS>
    <vCOFINS>66.26</vCOFINS>
    </COFINSAliq>
    </COFINS>
    </imposto>
    </det>
    <total>
    <ICMSTot>
    <vBC>3030.35</vBC>
    <vICMS>590.92</vICMS>
    <vICMSDeson>0.00</vICMSDeson>
    <vFCP>0.00</vFCP>
    <vBCST>0.00</vBCST>
    <vST>0.00</vST>
    <vFCPST>0.00</vFCPST>
    <vFCPSTRet>0.00</vFCPSTRet>
    <qBCMono>0.00</qBCMono>
    <vICMSMono>0.00</vICMSMono>
    <qBCMonoReten>0.00</qBCMonoReten>
    <vICMSMonoReten>0.00</vICMSMonoReten>
    <qBCMonoRet>0.00</qBCMonoRet>
    <vICMSMonoRet>0.00</vICMSMonoRet>
    <vProd>3030.35</vProd>
    <vFrete>0.00</vFrete>
    <vSeg>0.00</vSeg>
    <vDesc>0.00</vDesc>
    <vII>0.00</vII>
    <vIPI>0.00</vIPI>
    <vIPIDevol>0.00</vIPIDevol>
    <vPIS>50.00</vPIS>
    <vCOFINS>230.31</vCOFINS>
    <vOutro>0.00</vOutro>
    <vNF>3030.35</vNF>
    <vTotTrib>0.00</vTotTrib>
    </ICMSTot>
    </total>
    <transp>
    <modFrete>0</modFrete>
    <transporta>
    <CNPJ>10455471000148</CNPJ>
    <xNome>B M BOYS EXPRESS LTDA</xNome>
    <xEnder>RUA EBANO PEREIRA, 164 - CENTRO</xEnder>
    <xMun>CURITIBA</xMun>
    <UF>PR</UF>
    </transporta>
    <veicTransp>
    <placa>AAA1234</placa>
    <UF>PR</UF>
    </veicTransp>
    <vol>
    <qVol>15</qVol>
    <nVol>15</nVol>
    <pesoL>155.000</pesoL>
    <pesoB>155.000</pesoB>
    </vol>
    </transp>
    <cobr>
    <fat>
    <nFat>89485</nFat>
    <vOrig>3030.35</vOrig>
    <vDesc>0</vDesc>
    <vLiq>3030.35</vLiq>
    </fat>
    <dup>
    <nDup>001</nDup>
    <dVenc>2025-02-16</dVenc>
    <vDup>1515.17</vDup>
    </dup>
    <dup>
    <nDup>002</nDup>
    <dVenc>2025-03-18</dVenc>
    <vDup>1515.18</vDup>
    </dup>
    </cobr>
    <pag>
    <detPag>
    <indPag>1</indPag>
    <tPag>15</tPag>
    <vPag>3030.35</vPag>
    <card>
    <tpIntegra>2</tpIntegra>
    <tBand>99</tBand>
    </card>
    </detPag>
    </pag>
    <infAdic>
    <infCpl>COD CLI: 8957 NUM.PED: 40001338//NUM CAR: 137558COD COB: BK</infCpl>
    </infAdic>
    <infRespTec>
    <CNPJ>07577599000501</CNPJ>
    <xContato>TOTVS BRASILIA SOFTWARE - UNIDADE GOIANIA LTDA</xContato>
    <email>resp_tecnico_dfe_winthor@totvs.com.br</email>
    <fone>06232500200</fone>
    </infRespTec>
    </infNFe>
    <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
    <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
    <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
    <Reference URI="#NFe41250102677857000257550010000894851117232170">
    <Transforms>
    <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
    <Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
    </Transforms>
    <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
    <DigestValue>zcuzpoDiL5qZ8YjeatyJPUriUro=</DigestValue>
    </Reference>
    </SignedInfo>
    <SignatureValue>hswweHzVB0O0KgMyt1acCnJh7IJe2as6DNfzOhPlQwSy9sTpd0MrrvVxc9J25dK8iKz/OuUKdJ9awjI+RiSB0jyW2n5PPseHdZBM3mmpzl2ndBdhTFyKguNYHxz9axpIiE9M+fi8uqIHn5zFesYmP0wSDkjATxl74lqjaFU4/wSPoajm6HgUpSCRQkJY7NvRQJDh231//Z2ZNTa5b84tObtAGIOWuxlNtF8apskqnbjnmfbezGICX+gxnYrRMNDKZ/5cZdMj1ZgrmFZ1yJc0bp8w4flWbj7LAN/aHdnAj/Cc4SnibVqBT1kbm71jHPytiZtvxYV1oz7oWhN2tAj/GQ==</SignatureValue>
    <KeyInfo>
    <X509Data>
    <X509Certificate>MIIIEDCCBfigAwIBAgIQeTmNmsVtqVsd4d6emMXflDANBgkqhkiG9w0BAQsFADB4MQswCQYDVQQGEwJCUjETMBEGA1UEChMKSUNQLUJyYXNpbDE2MDQGA1UECxMtU2VjcmV0YXJpYSBkYSBSZWNlaXRhIEZlZGVyYWwgZG8gQnJhc2lsIC0gUkZCMRwwGgYDVQQDExNBQyBDZXJ0aXNpZ24gUkZCIEc1MB4XDTI0MDQyMjIxMDcwNloXDTI1MDQyMjIxMDcwNlowgfQxCzAJBgNVBAYTAkJSMRMwEQYDVQQKDApJQ1AtQnJhc2lsMQswCQYDVQQIDAJNUzEVMBMGA1UEBwwMQ2FtcG8gR3JhbmRlMRMwEQYDVQQLDApQcmVzZW5jaWFsMRcwFQYDVQQLDA4zMjEzNjQyMjAwMDE4NTE2MDQGA1UECwwtU2VjcmV0YXJpYSBkYSBSZWNlaXRhIEZlZGVyYWwgZG8gQnJhc2lsIC0gUkZCMRYwFAYDVQQLDA1SRkIgZS1DTlBKIEExMS4wLAYDVQQDDCVDT01FUkNJQUwgTEFOQ0FSRSBMVERBOjAyNjc3ODU3MDAwMTc2MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnxkKaQBEoOHCnJh19/7YTAyaP1vM7omzVnZH4kR9XakwirazVjXlAlaiZlxBQNF1jslcNCD5MBhbhmIeii3/eEWf27QyjFQSlzOUVajEkJFgnQpcALx/9D6v1IoguVHIrtUEK7ZjBzhGeXDDyULuj9MPuZcwkS5Og7LTGBxPKxWZ9uc3UkCBM5GSjr0znM2mvLEd/moSbTooMV95XeNVY9eZajonI2LM1Qrm1Kn6vzKpCxmikRjwQviobZudgGaozX72sxKiCs5+R8tZ0/5CVYsrYq9HHfk1xKBHdE/pNir57ynhQSHZetiIKgQuydedey3EqSZuVsOv93DU4lVX0wIDAQABo4IDFzCCAxMwgcYGA1UdEQSBvjCBu6A+BgVgTAEDBKA1BDMyMzAxMTk2MzQzNjI3NTUyOTIwMDAwMDAwMDAwMDAwMDAwMDAwMzQ2MjczNDdTRVNQUFKgJQYFYEwBAwKgHAQaTUlSSUFOIFNPTEFOR0UgUk9TU0EgRklMTEGgGQYFYEwBAwOgEAQOMDI2Nzc4NTcwMDAxNzagFwYFYEwBAwegDgQMMDAwMDAwMDAwMDAwgR5jZXJ0aWRhb2VjZXJ0aWZpY2Fkb0BnbWFpbC5jb20wCQYDVR0TBAIwADAfBgNVHSMEGDAWgBRTfX+dvtFh0CC62p/jiacTc1jNQjB/BgNVHSAEeDB2MHQGBmBMAQIBDDBqMGgGCCsGAQUFBwIBFlxodHRwOi8vaWNwLWJyYXNpbC5jZXJ0aXNpZ24uY29tLmJyL3JlcG9zaXRvcmlvL2RwYy9BQ19DZXJ0aXNpZ25fUkZCL0RQQ19BQ19DZXJ0aXNpZ25fUkZCLnBkZjCBvAYDVR0fBIG0MIGxMFegVaBThlFodHRwOi8vaWNwLWJyYXNpbC5jZXJ0aXNpZ24uY29tLmJyL3JlcG9zaXRvcmlvL2xjci9BQ0NlcnRpc2lnblJGQkc1L0xhdGVzdENSTC5jcmwwVqBUoFKGUGh0dHA6Ly9pY3AtYnJhc2lsLm91dHJhbGNyLmNvbS5ici9yZXBvc2l0b3Jpby9sY3IvQUNDZXJ0aXNpZ25SRkJHNS9MYXRlc3RDUkwuY3JsMA4GA1UdDwEB/wQEAwIF4DAdBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwQwgawGCCsGAQUFBwEBBIGfMIGcMF8GCCsGAQUFBzAChlNodHRwOi8vaWNwLWJyYXNpbC5jZXJ0aXNpZ24uY29tLmJyL3JlcG9zaXRvcmlvL2NlcnRpZmljYWRvcy9BQ19DZXJ0aXNpZ25fUkZCX0c1LnA3YzA5BggrBgEFBQcwAYYtaHR0cDovL29jc3AtYWMtY2VydGlzaWduLXJmYi5jZXJ0aXNpZ24uY29tLmJyMA0GCSqGSIb3DQEBCwUAA4ICAQCni+jNAdo3njXlQAiODfChjqZoyNOJFTF5prY4iVA4NFuapzdtOAioLOB9bY+tiU+kYQ8x+2kcy9GKwwLgHtYfi/dPil6/8ZDJfWtLcPbUwS5BWpIBhp4XmbE0iAmh4wBUHfPzYN7zJeLnZ9t0igbB8sO+jMy1XvwwGfCi8oBsWVswBs3+lTwGOlcB0+JZ7w6V++kvdnLxF4dsNcO/BNJO7SyfCj7iSj5Vi9UO1OgFAZwGSWoefpoBEsyuI9CGA3DUCwtSqEtIQiEjVcWEGNFmQ5+22WJZ1AeNqgqsVGxpSbQhlE9LaEqzWEBMPvla7/PBTsnUsUmDp/bcWUOUblvi1IDXoLQdcZzADRKr0kfHq+PAmSCQSIIQeBYA1ejTNz6W/2M0xrLqJbxBKhGzi3j8qSIB10lhQGEdbeHNviC5vOxXstXfQx1tuZggSAyV3voa2+tO50mouhREm6zpDUxgPO5gVp5S1NMkzQ/Q2Wap+XO8vB0I9719s2JL4F/PKYbb+N7YeTJBNBVyoHFzaimaNh8uelXNW5XNm6reP9Vv9Dv1Sf1ia3dO7HCMJdm/7nHFrKlKlNmrWjlz0RtGwrmL576khMRNfNbJaV6VtbMR0kE8t49HRmu7oJ03yXTc0Yfqpoj4XdQCbmDK42WUbQS2lPgl54sELxCB1AMIUGrjJg==</X509Certificate>
    </X509Data>
    </KeyInfo>
    </Signature>
    </NFe>
    <protNFe versao="4.00">
    <infProt Id="ID141250017498883">
    <tpAmb>1</tpAmb>
    <verAplic>PR-v4_8_77</verAplic>
    <chNFe>41250102677857000257550010000894851117232170</chNFe>
    <dhRecbto>2025-01-17T10:05:44-03:00</dhRecbto>
    <nProt>141250017498883</nProt>
    <digVal>zcuzpoDiL5qZ8YjeatyJPUriUro=</digVal>
    <cStat>100</cStat>
    <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
    </protNFe>
    </nfeProc>
    `

    const options = {
        // Remove os prefixos de namespace das tags
        tagNameProcessors: [processors.stripPrefix]
      };
      
      async function parseXML() {
        try {
          const result = await parseStringPromise(xmlString, options);
          // Verifique a estrutura completa para confirmar a hierarquia
          
          // Acesse a tag infNFe considerando o elemento raiz 'xml'
          const productsArr = result.nfeProc.NFe[0].infNFe[0].det;
          //[0].prod[0].NCM

            console.log(productsArr)

            productsArr.forEach((product: any) => {
                const ncm = product.prod[0].NCM[0]
                console.log(ncm)
                const productValue = product.prod[0].vProd[0]
                console.log(productValue)
            })


        } catch (err) {
          console.error('Erro ao fazer parse do XML:', err);
        }
      }
      
      parseXML();

    reply.status(201).send("ok")

}